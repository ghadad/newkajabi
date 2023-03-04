function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function getDivsMessages(messages=[]){
  return '<div id="twofa-error" class="twofa-error">' + 
   messages.map(function(e,i) { 
    return '<div class="msg_"'+i +'">' + e +'</div>';
  }).join("") +'</div>'

}

const errEl = document.createElement("div");
errEl.innerHTML = "";



document.addEventListener("DOMContentLoaded", function () {
  const BASE_URL = "https://udifili.com/api/";

  const qs = function () {
    let getVars = {};
    let uri = window.location.href.split("?");
    if (uri.length == 2) {
      let vars = uri[1].split("&");
      let tmp = "";
      vars.forEach(function (v) {
        tmp = v.split("=");
        if (tmp.length == 2) getVars[tmp[0]] = tmp[1];
      });
    }
    return getVars;
  };

  const request = async function (path, body, type = "json") {
    const response = await fetch(BASE_URL + path, {
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
      error: "",
      mounted: false,
      twofa: false,
      qrImage: "",
    },
    async mounted() {
      var imgElement = document.querySelector('img[alt="getqr"]');
      if (imgElement) {
         imgElement.parentElement.classList.add('qr-wrapper');
      } 
      insertAfter(imgElement, errEl);
      var errorElement = errEl ;// document.querySelector('#twofa-error');
      imgElement.className += " qrcode";
      var self = this;
      self.mounted = true;
      self.qrImage = "";
      const queryParams = qs();
      const email = queryParams.email;
      if (!email) {
        errorElement.innerHTML =getDivsMessages(["חסר אימייל להפעלה"]) ;
        imgElement.src = "https://udifili.com/images/qrerr.png";
        return;
      } 
      
        try {
        const result = await request("qrcode", { email: email });
        if (result.success) {
          self.qrImage = result.dataUrl;
          imgElement.src = result.dataUrl;
          self.twofa = true;
        } else if (result.code =="ALREADY_REGISTERED") {
             errorElement.innerHTML =getDivsMessages(["הקוד כבר הופעל בעבר , תוכל ליצור קוד חדש במסך ההתחברות לאתר דיפוזיה",
             "<a href='login'>מסך התחברות של אתר דיפוזיה</a>"]);
            imgElement.src = "https://udifili.com/images/qrerr.png";
          }          
          else if (result.code =="ACTIVATION_ERROR") {
            errorElement.innerHTML =getDivsMessages(["קוד הפעלה שגוי , תוכל ליצור קוד חדש במסך ההתחברות לאתר דיפוזיה",
             "<a href='login'>מסך התחברות של אתר דיפוזיה</a>"]);
           imgElement.src = "https://udifili.com/images/qrerr.png";
         }          
          else if(result.code =="NOT_FOUND") {
            errorElement.innerHTML = getDivsMessages([ "אימייל לא נמצא במערכת"]);
            imgElement.src = "https://udifili.com/images/qrerr.png";
          } else {
          errorElement.innerHTML = result.message || "התרחשה שגיאה";
            imgElement.src = "https://udifili.com/images/qrerr.png";
	  }
      } catch (e) {
        errorElement.innerHTML = "שגיאה ביצירת ברקוד";
        console.info(e);
      }
    },
  });
});
