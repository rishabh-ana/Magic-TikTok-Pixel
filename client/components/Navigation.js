import React, { useState, useCallback } from "react";
import { Modal, TextContainer } from "@shopify/polaris";

function Navigation() {
  const [support, setSupport] = useState(false);
  const handleSupport = useCallback(() => setSupport(!support), [support]);
  const [analytics, setAnalytics] = useState(false);
  const handleAnalytics = useCallback(
    () => setAnalytics(!analytics),
    [analytics]
  );

  return (
    <div>
      <div className="navigationMain">
        <div>
          <p>
            <a style={{ color: "#5c6ac4" }} href="/index">
              Home Page
            </a>
          </p>
        </div>
        <div>
          <p>
            <a onClick={handleSupport} href="#">
              Support
            </a>
          </p>
        </div>
        <div>
          <p>
            <a onClick={handleAnalytics} href="#">
              TikTok Analytics
            </a>
          </p>
        </div>
      </div>
      <Modal
        open={support}
        onClose={handleSupport}
        title="Support"
        secondaryActions={[
          {
            content: "Close",
            onAction: handleSupport,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>
              Feel free to reach us by email:{" "}
              <a href="mailto:olivia@smartecomtech.com" target="_blank">
                olivia@smartecomtech.com
              </a>
              .
              <br />
              (Monday - Friday, 9am to 5pm)
            </p>
          </TextContainer>
        </Modal.Section>
      </Modal>
      <Modal
        open={analytics}
        onClose={handleAnalytics}
        title="TikTok Analytics"
        secondaryActions={[
          {
            content: "Close",
            onAction: handleAnalytics,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <ul>
              <li>
                Head over to your TikTok ads dashboard at{" "}
                <a href="https://ads.tiktok.com/" target="_blank">
                  ads.tiktok.com
                </a>
              </li>
              <li>Click the "Library" from the top menu and go to "Event".</li>
              <li>Click "Manage" under Website Pixel.</li>
              <li>Find your TikTok Pixel ID and click "View conversions"</li>
            </ul>
            <p>
              You can now see all of your conversion statistics. TikTok can take
              anywhere from a couple minutes to several hours to update these
              stats so check back if you’re not seeing the stats you expect.
            </p>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  );
}

export default Navigation;
