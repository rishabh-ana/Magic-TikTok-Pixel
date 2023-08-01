import React, { useState, useEffect, useRef } from "react";
import {
  Layout,
  Page,
  Banner,
  Card,
  Frame,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
  Heading,
  Scrollable,
} from "@shopify/polaris";
const config = require("../server/config/httpConfig.js");
import axios from "axios";
import CreateBase from "../client/components/CreateBase.js";
import EventOptions from "../client/components/EventOptions.js";
import Navigation from "../client/components/Navigation.js";
import Recommend from "../client/components/Recommend.js";

function Index() {
  const isInitialMount = useRef(true);
  const [dataID, setDataID] = useState();
  const [tkID, setTKID] = useState();
  const approve = useRef("block");
  const [pending, setPending] = useState(true);
  const deadline = useRef(0);
  const [refresh, setRefresh] = useState(false);
  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  var id = "";

  useEffect(() => {
    async function getID(shop) {
      const data = await axios.post(config.HTTP_API + "/store/getid", {
        shop: shop,
      });
      return data.data[0].id;
    }

    async function checkStatus() {
      const url = new URL(window.location);
      const shop = url.searchParams.get("shop") + "";
      deadline.current++;
      //get id
      id = await getID(shop);
      setDataID(id);
      await axios
        .post(config.HTTP_API + "/store/getcharge/" + id)
        .then(async (result) => {
          if (result.data === "active") setPending(false);
          else {
            setPending(true);
            approve.current = "none";
            window.top.location = result.data;
          }
        });
    }

    async function getData() {
      const db_data = { search: id == "" ? dataID : id };
      await axios
        .post(config.HTTP_API + "/store/search/tk_id", db_data)
        .then((result) => {
          setTKID(result.data[0].tk_id);
        });
    }

    async function fetchData() {
      if (isInitialMount.current) {
        await checkStatus();
        isInitialMount.current = false;
        await getData();
      }
      if (refresh && !isInitialMount.current) {
        await getData();
        setRefresh(false);
      }
    }
    fetchData();
  });

  return (
    <div>
      {!pending ? <Navigation /> : null}
      <Frame>
        <Page>
          <Banner title="Magic TikTok Pixel" status="success">
            <p>One Click TikTok Conversion Event Tracking.</p>
            Like our app? We value your reviews! Simply{" "}
            <a
              href="https://apps.shopify.com/magic-tiktok-pixel#modal-show=ReviewListingModal"
              target="_blank"
            >
              leave us a review
            </a>{" "}
            or{" "}
            <a href="mailto:olivia@smartecomtech.com" target="_blank">
              email us
            </a>{" "}
            if you need any help!
          </Banner>
          <br />
<Card title="FAQ" sectioned>
                  <Scrollable style={{ height: "300px" }} focusable>
                    <TextContainer>
                      <Heading>How to Find Your TikTok Pixel ID</Heading>
                      <ul>
                        <li>
                          Log in to your{" "}
                          <a href="https://ads.tiktok.com/" target="_blank">
                            TikTok Ads account
                          </a>
                          , go to "Library" and click "Event" in the drop-down
                          menu, then choose "Website Pixel" to obtain the pixel
                          code.
                        </li>
                        <li>
                          If you don't have any pixel ID, just click "Create
                          Pixel". Copy and paste the ID to the app's Basic Setup
                          section
                        </li>
                        <img
                          alt="How your ID looks like"
                          src="https://cdn.shopify.com/s/files/1/0313/1447/7188/files/tik1.png?v=1583958266"
                        />
                      </ul>
                    </TextContainer>
                    <TextContainer>
                      <br />
                      <hr />
                      <Heading>
                        Why my plugin shows 'No event triggering' after
                        installing the pixel?
                      </Heading>
                      <p>
                        Magic TikTok Pixel helps you to install the basic code
                        which allows you to track all the events you created
                        from the TikTok dashboard. In addition, TikTok lets
                        users create events from their dashboard instead of any
                        third-party app.{" "}
                      </p>
                      <p>
                        You will be able to see the tracking after you create
                        events through you TikTok dashboard.
                      </p>
                    </TextContainer>
                    <TextContainer>
                      <br />
                      <hr />
                      <Heading>
                        How to create events from TikTok dashboard?
                      </Heading>
                      <p>
                        <a
                          href="https://ads.tiktok.com/help/article?aid=573722398920296903"
                          target="_blank"
                        >
                          Click here
                        </a>{" "}
                        to know the details of how to create events through
                        TikTok. Once events have been created, you will be able
                        to track them through your website.
                      </p>
                    </TextContainer>
                    <TextContainer>
                      <br />
                      <hr />
                      <Heading>
                        Why there's no event showing on my website?
                      </Heading>
                      <p>
                        You can use{" "}
                        <a
                          href="https://chrome.google.com/webstore/detail/tiktok-pixel-helper/aelgobmabdmlfmiblddjfnjodalhidnn"
                          target="_blank"
                        >
                          TikTok Pixel Helper
                        </a>{" "}
                        to check if there's any event running on your website.
                        It takes around 1 - 10 seconds for the plugin to refresh
                        after you make any changes.
                      </p>
                      <p>
                        If something still going wrong, don't hesitate to reach
                        us by{" "}
                        <a
                          href="mailto:support@smartecomtech.com"
                          target="_blank"
                        >
                          support@smartecomtech.com
                        </a>{" "}
                        and we will help you ASAP.
                      </p>
                    </TextContainer>
                  </Scrollable>
                </Card>
<br/>
          {!pending ? (
            !tkID ? (
              <div>
                <Banner
                  className="index-banner"
                  title="Events are not enabled."
                  status="warning"
                >
                  <p>
                    You need to submit your TikTok Pixel ID before to enable the
                    events tracking.
                  </p>
                </Banner>
                <br />
                <CreateBase valueID={dataID} setRefresh={handleRefresh} />
<br />
<br />
              </div>
            ) : (
              <div>
                <Banner
                  className="index-banner"
                  title="Congratulations! Events are now available."
                  status="success"
                >
                  <p>
                    You can now start to install pixel code by selecting from
                    the Pxel options list.{" "}
                  </p>
                  <p>
                    After installing, you can create event tracking from your
                    TikTok dashboard.
                  </p>
                  <p>
                    <a
                      href="https://ads.tiktok.com/help/article?aid=573722398920296903"
                      target="_blank"
                    >
                      Learn how to create TikTok events
                    </a>
                  </p>
                </Banner>
                <br />
                <CreateBase valueID={dataID} setRefresh={handleRefresh} />
                <br />
                <EventOptions valueID={dataID} />
                <br />
                <br />
                <Recommend />
                <br />
                <br />
              </div>
            )
          ) : (
            <SkeletonPage title="Preparing...">
              <Layout>
                <Layout.Section>
                  <Card subdued>
                    <Card.Section>
                      <TextContainer>
                        <SkeletonDisplayText size="small" />
                        <SkeletonBodyText lines={2} />
                      </TextContainer>
                    </Card.Section>
                    <Card.Section>
                      <SkeletonBodyText lines={2} />
                    </Card.Section>
                  </Card>
                </Layout.Section>
              </Layout>
            </SkeletonPage>
          )}
        </Page>
      </Frame>
    </div>
  );
}

export default Index;
