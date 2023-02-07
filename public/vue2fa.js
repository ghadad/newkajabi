
 
  new Vue({
    el: "#twofa",
    data: {
      mounted:false,
      verified:false,
      formData: {
        name: '',
        email: '',
        password: ''       
    },
    QRImage:''
},
 
    mounted() {
       var  self = this;
        self.mounted =true;
      fetch('https://udifili.com/api/qrcode?email=ghadad@gmail.com', {
                headers: { 'Content-Type': 'text/html'  }  
        }).then(response => response.text())          
          .then(html => { 
            self.QRImage=html;
          })
          .catch(e=>console.log(e))
    },
    methods: {
      submitForm() {
        // perform form submission here, using this.formData
        console.log(this.formData)
      }
    },
    computed: {
        email:function() {
            if(!this.mounted)
            return ;
            return this.formData.email;
        },
        qrCode:function(){ 
            if(this.QRImage)
            return this.QRImage; 
            return "Waiting";
        }
    }
  });
  
  
