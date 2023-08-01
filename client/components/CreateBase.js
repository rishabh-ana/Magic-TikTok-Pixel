import React, { useState, useEffect, useRef } from "react";
import {
  FormLayout,
  TextField,
  Button,
  Toast,
  Layout,
  Card,
} from "@shopify/polaris";
import axios from "axios";
const config = require("../../server/config/httpConfig.js");

function CreateBase(props) {
  const isInitialMount = useRef(true);
  const [displayTikTokID, setDisplayTikTokID] = useState();
  const handleTikTokIDChange = (value) => setDisplayTikTokID(value);
  const [current, setCurrent] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [message, setMessage] = useState();
  const [showToast, setToast] = useState(false);
  const toggleToast = () => setToast(!showToast);
  const toastMarkup = showToast ? (
    <Toast content={message} onDismiss={toggleToast} Diduration={2500} />
  ) : null;

  useEffect(() => {
    async function getData() {
      const db_data = { search: props.valueID };
      await axios
        .post(config.HTTP_API + "/store/search/tk_id", db_data)
        .then((result) => {
          setCurrent(result.data[0].tk_id);
        });
    }
    async function fetchData() {
      if (isInitialMount.current && props.valueID) {
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
          title="Basic Setup"
          description="Submit your TikTok Pixel ID to start tracking events"
        >
          <Card sectioned>
            <FormLayout>
              <TextField
                id="tiktokID"
                value={displayTikTokID}
                placeholder={current}
                onChange={handleTikTokIDChange}
                label="TikTok Pixel ID"
                error={errorMsg}
              />
              <Button
                primary
                onClick={() => {
                  setErrorMsg("");
                  displayTikTokID
                    ? axios
                        .put(config.HTTP_API + "/store/" + props.valueID, {
                          tk_id: displayTikTokID,
                        })
                        .then(() => {
                          setMessage("Successfully Activated!");
                          toggleToast();
                          props.setRefresh(true);
                        })
                    : setErrorMsg("TikTok Pixel ID is required");
                }}
              >
                Submit
              </Button>
            </FormLayout>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </div>
  );
}

export default CreateBase;
