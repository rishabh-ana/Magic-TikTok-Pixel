import { Page, TextContainer, Heading } from "@shopify/polaris";
import Navigation from "../client/components/Navigation.js";

function FaqLayout() {
  return (
    <div>
      <Navigation />
      <Page>
        <TextContainer>
          <Heading>How to Find Your TikTok Pixel ID</Heading>
          <ul>
            <li>
              Log in to your{" "}
              <a href="https://ads.tiktok.com/" target="_blank">
                TikTok Ads account
              </a>
              , go to "Library" and click "Event" in the drop-down menu, then
              choose "Website Pixel" to obtain the pixel code.
            </li>
            <li>
              If you don't have any pixel ID, just click "Create Pixel". Copy
              and paste the ID to the app's Basic Setup section
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
            Why my plugin shows 'No event triggering' after installing the
            pixel?
          </Heading>
          <p>
            Magic TikTok Pixel helps you to install the basic code which allows
            you to track all the events you created from the TikTok dashboard.
            In addition, TikTok lets users create events from their dashboard
            instead of any third-party app.{" "}
          </p>
          <p>
            You will be able to see the tracking after you create events through
            you TikTok dashboard.
          </p>
        </TextContainer>
        <TextContainer>
          <br />
          <hr />
          <Heading>How to create events from TikTok dashboard?</Heading>
          <p>
            <a
              href="https://ads.tiktok.com/help/article?aid=573722398920296903"
              target="_blank"
            >
              Click here
            </a>{" "}
            to know the details of how to create events through TikTok. Once
            events have been created, you will be able to track them through
            your website.
          </p>
        </TextContainer>
        <TextContainer>
          <br />
          <hr />
          <Heading>Why there's no event showing on my website?</Heading>
          <p>
            You can use{" "}
            <a
              href="https://chrome.google.com/webstore/detail/tiktok-pixel-helper/aelgobmabdmlfmiblddjfnjodalhidnn"
              target="_blank"
            >
              TikTok Pixel Helper
            </a>{" "}
            to check if there's any event running on your website. It takes
            around 1 - 10 seconds for the plugin to refresh after you make any
            changes.
          </p>
          <p>
            If something still going wrong, don't hesitate to reach us by{" "}
            <a href="mailto:support@smartecomtech.com" target="_blank">
              support@smartecomtech.com
            </a>{" "}
            and we will help you ASAP.
          </p>
        </TextContainer>
        <br />
        <br />
      </Page>
    </div>
  );
}

export default FaqLayout;
