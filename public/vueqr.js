document.addEventListener("DOMContentLoaded", function () {
  const BASE_URL = "https://udifili.com/api";

const qs = function(){
     let getVars = {};
     let uri = window.location.href.split('?');
    if(uri.length == 2) {
      let vars = uri[1].split('&');
      let tmp = '';
      vars.forEach(function(v) {
        tmp = v.split('=');
        if(tmp.length == 2)
          getVars[tmp[0]] = tmp[1];
      });
    }
    return getVars ;
  }

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
    el: "#twofa-qrcode",
    data: {
      error:"",
      mounted: false,
      twofa: false,
      qrImage: ""
    },
    async mounted() {
      var imgElement = document.querySelector('img[alt="getqr"]')
      var self = this;
      self.mounted = true;
      self.qrImage = "";
      const queryParams = qs();
      const email=queryParams.email;
      if(!email) 
	    return alert("missing email");
      try {
        const result = await request("qrcode", { email: email });
        if (result.success) {
          self.qrImage = result.dataUrl;
		imgElement.src = self.qrImage;
          self.twofa = true;
        } else {
          self.error = result.message;
	}
      } catch (e) {
          self.error = e.message;
        console.info(e);
      }
    }
  });
});
