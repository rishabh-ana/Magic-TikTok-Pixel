module.exports = {
  HTTP_API: "https://app.magictiktokpixel.com",
  ExtractId: function (str) {
    var matches = str.match(/(\d+)/);
    if (matches) return matches[0];
  },
  ExtractComfirmID: function (str) {
    const result = str.split("/charges/")[1];
    const final = result.split("/confirm_")[0];
    return final;
  },

  CombineThemeID: function (str) {
    var str1 = "gid://shopify/Theme/";
    str = str1.concat(str);
    return str;
  },
  InstallBaseCode: function (code, id) {
    const exist = code.indexOf("<!-- TikTok Pixel Base Code -->");
    if (exist > 0) {
      //its exist
      const str = `<script>
(function() {
    var ta = document.createElement('script'); ta.type = 'text/javascript'; ta.async = true;
    ta.src = 'https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=${id}';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ta, s);
  })();
</script>`;
      const result = code.replace(
        code.split("<!-- TikTok Pixel Base Code -->")[1],
        str
      );
      return result;
    } else {
      const index = code.indexOf("</head>");
      const str =
        "<!-- TikTok Pixel Base Code --><script>(function() {var ta = document.createElement('script'); ta.type = 'text/javascript'; ta.async = true;ta.src = document.location.protocol + '//' + 'static.bytedance.com/pixel/sdk.js?sdkid=" +
        id +
        "';var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(ta, s);})();</script><!-- TikTok Pixel Base Code -->";
      const str1 = code.substring(0, index);
      const str2 = code.substring(index - 1, code.length);
      const result = str1.concat(str).concat(str2);
      return result;
    }
  },
  DeleteBaseCode: function (code) {
    const exist = code.indexOf("<!-- TikTok Pixel Base Code -->");
    if (exist > 0) {
      //its exist
      const result = code
        .split("<!-- TikTok Pixel Base Code -->")[0]
        .concat(code.split("<!-- TikTok Pixel Base Code -->")[2]);
      return result;
    } else {
      return code;
    }
  },
};
