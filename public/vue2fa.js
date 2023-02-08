Vue.component('token-component', {
    props: ["email"],
    data() {
        return {
            token: null,
        };
    },
    template: `<div class=\"box\">  email: {{$props}}   <div class="form-group">
  <label
    for="member_email"
    kjb-settings-id="sections_login_settings_email"
    >Enter authenticator code </label
  >
  <input
    class="form-control auth__field"
    spellcheck="false"
    autocorrect="off"
    type="number"
    v-model="token"
    ref="token"
    id="member_token"
    value=""
  />
  <button
  id="form-button"
  ref="member_verify"
  class="form-btn btn--outline btn--auto btn--large"
  @click="$parent.verify($event,token)"
  kjb-settings-id="sections_login_settings_btn_text"
>
  Submit
</button>
</div> </div>`
});

Vue.component('qr-component', {
    props: ["qrImage"],
    template: `<div class=\"box\"> qr :<div v-html="$props.qrImage"></div></div>`
});


new Vue({
    el: "#twofa",
    data: {
        mounted: false,
        verified: false,
        twofa: false,
        formData: {
            name: '',
            email: '',
            password: ''
        },
        QRImage: ''
    },
    watch: {
        'formData.email': (oldval, newval) => {
            console.log(newval);
        }
    },
    mounted() {
        var self = this;
        self.mounted = true;
        self.twofa = true;
    },
    methods: {
        async verify(e) {
            e.preventDefault();
            
            if (!(this.formData.email && this.$refs.tokenComponent.token && this.formData.password)){
                alert("missing token or email or password");
                return ;
            }
            if(!this.validateEmail(this.formData.email))    {
                alert("please insert valid email");
                return ;
            }
            try { 
                const response = await fetch("https://udifili.com/api/verify",{
                                            method: 'POST',
                                            //mode: 'no-cors', // no-cors, *cors, same-origin
                                            cache: 'no-cache', // *default, no-cache, reload, force-
                                            headers: {
                                                'Content-Type': 'application/json'
                                                // 'Content-Type': 'application/x-www-form-urlencoded',
                                                //'Content-Type': 'text/html',
                                            },
                                            body: JSON.stringify({"email":this.formData.email,"token":this.$refs.tokenComponent.token}) 
                    });
                const result = await response.json();
            } catch(err) { 
                console.error(err)
            }
    return false
     },
        verify2(e, token) {
            e.preventDefault();
            if (!(this.formData.email && token && this.formData.password))
                alert("missing token or email or password")
            alert(this.formData.email + ' ' + token + ' ' + this.formData.password);
            //  this.$refs.member_submit.click();
            return false
        },
        validateEmail: function (input) {
           
            var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
          
            if (input.match(validRegex))
                return true;
            return false;
        },
        getQrCode: async () => {
            if (!this.validateEmail(this.formData.email))
                return;
            try {
                let response = await fetch('https://udifili.com/api/qrcode?' + this.formData.email, {
                    headers: { 'Content-Type': 'text/html' }
                });
                this.QRImage = await response.text();
            } catch (e) {
                console.error(e);
            }
        },
        submitForm() {
            // perform form submission here, using this.formData
            console.log(this.formData)
        }
    },
    computed: {
        email: function () {
            if (!this.mounted)
                return;
            return this.formData.email;
        },
        qrCode: function () {
            if (this.QRImage)
                return this.QRImage;
            return "Waiting";
        }
    }
});


