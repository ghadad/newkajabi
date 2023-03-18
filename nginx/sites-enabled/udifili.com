server {

        root /var/www/html;
        index index.html ;

        server_name udifili.com www.udifili.com;

        location /blalalla {
         proxy_pass http://localhost:3000;
         proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection 'upgrade';
         proxy_set_header Host $host;
         proxy_cache_bypass $http_pragma;
        }


    location / {
        root /var/www/html;
        index index.html index.htm index.php;
        try_files $uri $uri/ @node;
    }

     location @node {
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_pass http://localhost:3000;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;

    }

   location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
     }

    location ~ /\.ht {
        deny all;
    }

    error_page 404 /404.html;
    location = /404.html {
    root /var/www/html;
    internal;
    }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/udifili.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/udifili.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}
server {
    if ($host = www.udifili.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = udifili.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        listen 80;
        listen [::]:80;

        server_name udifili.com www.udifili.com;
        return 404; # managed by Certbot

}
