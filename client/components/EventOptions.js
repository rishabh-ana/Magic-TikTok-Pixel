import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FormLayout,
  Button,
  Toast,
  Layout,
  Card,
  Checkbox,
} from "@shopify/polaris";
import axios from "axios";
const config = require("../../server/config/httpConfig.js");

function EventOptions({ valueID }) {
  const isInitialMount = useRef(true);
  const [base, setBase] = useState();
  const [checkout, setCheckout] = useState();
  const [tkID, setTKID] = useState();
  const handleCheckout = useCallback((newChecked) => setCheckout(newChecked));
  const handleBase = useCallback((newChecked) => setBase(newChecked));
  const [message, setMessage] = useState();
  const [showToast, setToast] = useState(false);
  const toggleToast = () => setToast(!showToast);
  const toastMarkup = showToast ? (
    <Toast content={message} onDismiss={toggleToast} Diduration={2500} />
  ) : null;

  useEffect(() => {
    async function getData() {
      const db_data = { search: valueID };
      await axios
        .post(config.HTTP_API + "/store/search/event", db_data)
        .then((result) => {
          setBase(result.data[0].base);
          setCheckout(result.data[0].checkout);
          setTKID(result.data[0].tk_id);
        });
    }
    async function fetchData() {
      if (isInitialMount.current && valueID) {
        isInitialMount.current = false;
        await getData();
      }
    }
    fetchData();
  }, []);
  return (
    <div>
      {toastMarkup}
      <Layout>
        <Layout.AnnotatedSection
          title="Pixel Options"
          description="Select the pixel you want to install. Make sure you Save Changes after you changing your TikTok Pixel ID"
        >
          <Card sectioned>
            <FormLayout>
              <Checkbox
                label="Base event"
                checked={base}
                onChange={handleBase}
                helpText="Enable User registration, Page visit, Add to cart, Place an order tracking."
              />
              <Checkbox
                label="Complete payment"
                checked={checkout}
                onChange={handleCheckout}
                helpText="Enable Complete payment tracking."
              />
              <Button
                primary
                onClick={() => {
                  const init_data = {
                    checkout: 0,
                    base: 0,
                  };
                  axios
                    .put(config.HTTP_API + "/store/" + valueID, init_data)
                    .then(() => {
                      const db_data = {
                        base: base,
                        checkout: checkout,
                      };
                      axios
                        .put(config.HTTP_API + "/store/" + valueID, db_data)
                        .then(async ({ data }) => {
                          //install or uninstall checkout
                          if (checkout != 0) {
                            axios
                              .post(
                                config.HTTP_API + "/store/search/script_id",
                                { search: valueID }
                              )
                              .then(async (ress) => {
                                if (
                                  ress.data[0].script_id &&
                                  ress.data[0].script_id != 0
                                ) {
                                  axios
                                    .delete(
                                      "/deleteCheckout/" +
                                        ress.data[0].script_id
                                    )
                                    .then(async (resD) => {
                                      await axios.put(
                                        config.HTTP_API + "/store/" + valueID,
                                        { script_id: "" }
                                      );
                                      await axios.post(
                                        "/checkoutJS/" + valueID
                                      );
                                    });
                                } else {
                                  await axios.post("/checkoutJS/" + valueID);
                                }
                              });
                          } else {
                            axios
                              .post(
                                config.HTTP_API + "/store/search/script_id",
                                { search: valueID }
                              )
                              .then(async (res) => {
                                if (
                                  res.data[0].script_id &&
                                  res.data[0].script_id != 0
                                ) {
                                  //if have script id, delete script
                                  axios
                                    .delete(
                                      "/deleteCheckout/" + res.data[0].script_id
                                    )
                                    .then(async (resD) => {
                                      await axios.put(
                                        config.HTTP_API + "/store/" + valueID,
                                        { script_id: "" }
                                      );
                                    });
                                }
                              });
                          }
                          //install base or uninstall base
                          if (base != 0) {
                            await axios.get(
                              "/themeJS/" + tkID + "/base/install"
                            );
                          } else {
                            await axios.get(
                              "/themeJS/" + tkID + "/base/delete"
                            );
                          }

                          setMessage("Changes Saved!");
                          toggleToast();
                        });
                    });
                }}
              >
                Save Changes
              </Button>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </div>
  );
}

export default EventOptions;
