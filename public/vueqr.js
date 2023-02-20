document.addEventListener("DOMContentLoaded", function () {
  const BASE_URL = "https://udifili.com/api";

  const request = async function (path, body, type = "json") {
    const response = await fetch("https://udifili.com/api/" + path, {
      method: "POST",
      mode: "cors",
      cache: "no-cache", // *default, no-cache, reload, force-
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (type == "json") return await response.json();
    return await response.text();
  };
  new Vue({
    el: "#twofa",
    data: {
      mounted: false,
      twofa: false,
      qrImage:null
    },
    mounted() {
      var self = this;
      self.mounted = true;
        self.qrImage = "";
        const email = self.$parent.formData.email;
        if (!self.validateEmail(email)) {
          this.error = ' כתובת דוא"ל חסרה או שאינה  תקינה ';
          return;
        }
        try {
          const result = await request("qrcode", { email: email });
          if (result.success) {
            self.qrImage = result.qr;
            self.twofa = true;
          } else {
            if (result.code == "ALREADY_REGISTERED")
              self.error =
                " הנך רשום לשירות הזדהות בשני שלבים , אנא הירשם שוב אם הינך צריך להנפיק ברקוד רישום חדש";
            else self.error = result.message;
          }
        } catch (e) {
          console.info(e);
        }
      },
  });
});
