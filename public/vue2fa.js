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

  const getRequest = async function (path, type = "json") {
    const response = await fetch("https://udifili.com/api/" + path, {
      method: "POST",
      mode: "cors",
      cache: "no-cache", // *default, no-cache, reload, force-
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (type == "json") return await response.json();
    return await response.text();
  };



  Vue.component("token-component", {
    data() {
      return {
        error: "",
        message: "",
        token: null,
        qrImage: "",
      };
    },
    watch: {
      token(oldval, newval) {
        this.error = "";
      },
    },
    methods: {
      validateEmail: function (input) {
        var validRegex =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (input.match(validRegex)) return true;
        return false;
      },
      async verify(e) {
        const self = this;
        self.message="";
        let email = this.$parent.formData.email;
        let password = this.$parent.formData.password;
        let token = this.token;
        e.preventDefault();
        if (!(email && token && password)) {
          this.error = "חסרים פרטי כניסה";
          return;
        }
        if (!this.validateEmail(email)) {
          this.error = 'כתובת דוא"ל אינה תקינה';
          return;
        }
        try {
          const result = await request("verify", {
            email: email,
            token: token,
          });
          if (result.success) {
            document.querySelector("#new_member_session").submit();
          } else {
            self.error = "אימות דו שלבי נכשל אנא נסו שוב ";
          }
        } catch (err) {
          console.error(err);
        }
        return false;
      },
      createSecret: async function (e) {
        e.preventDefault();
        const self = this;
        self.qrImage = "";
        const email = self.$parent.formData.email;
        if (!self.validateEmail(email)) {
          this.error = ' כתובת דוא"ל חסרה או שאינה  תקינה ';
          return;
        }
        try {
          const result = await request("create-secret", { email: email });
          if (result.success) {
		            self.message = "נשלח אלייך מייל להמשך הוראות להפעלת האימות<br>(אם לא קיבלתם – חפשו בתיבת הספאם)";

          } else { 
            this.error = result.message;
          }
        } catch (e) {
          this.error = e.message;
          console.error(e);
        }
      },

      getQrCode: async function () {
        const self = this;
        self.qrImage = "";
        const email = self.$parent.formData.email;
        if (!self.validateEmail(email)) {
          this.error = 'כתובת דוא"ל חסרה או שאינה  תקינה ';
          return;
        }
        try {
          const result = await request("qrcode", { email: email });
          if (result.success) {
            self.qrImage = result.qr;
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
    },
    template: `<div class=\"box\">   
    <div class="form-group">
    <label
        for="twofa_token"
        class="twofa"
        kjb-settings-id="sections_login_settings_email"
        >הזינו את הקוד מאפליקציית האימות </label
    >
        <input
            class="form-control auth__field"
            spellcheck="false"
            autocorrect="off"
            type="number"
            v-model="token"
            value=""
        />
    </label>
    </div>
    <div  class="form-group twofa-register">
    <a href="#" @click="createSecret($event)">    רישום/איפוס חשבון אימות דו שלבי  </a>
     </div>
    <div v-show="error" class="form-group twofa-error">{{ error }} </div>
    <div v-show="message" class="form-group twofa-message" v-bind-html="message"></div>
    
    <button 
    class="form-btn btn--outline btn--auto btn--large"
    @click="verify($event)"
    >
    התחברות
    </button>
    </div> 
</div>`,
  });

  new Vue({
    el: "#twofa",
    data: {
      mounted: false,
      twofa: false,
      systemUp :false,
      formData: {
        name: "",
        email: "",
        password: "",
      },
    },
    watch: {
      "formData.email": function (oldval, newval) {
        this.$refs.tokenComponent.error = "";
      },
      "formData.password": function (oldval, newval) {
        this.$refs.tokenComponent.error = "";
      },
    },
    async mounted() {
      var self = this;
      self.mounted = true;
      if (window.location.href.match(/\?twofa=true/)) self.twofa = true;
      try {
        let result = await getRequest("info");
        self.systemUp =  result.success;
      } catch(e) { 
        self.systemUp = false;
      }
    },
  });
});
