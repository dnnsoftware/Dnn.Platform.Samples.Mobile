# Dnn.Platform.Samples.Mobile
Sample Mobile Apps to access DNN Platform Web APIs

#Telerik App
We will be using Telerik’s App Builder platform in order to create a sample hybrid app that provides a simple UI that prints out data returned from an external API request using Monikers & JWT for validation.

#Telerik App Pre-requisites
  1.)	Telerik Account – for the app builder, 30 day free trial
  
  2.)	Clean copy of latest Platform build (as long as JWT is active)
  
  3.)	SPA Sample Module on local platform build
  
  4.)	Smartphone / tablet / local machine to test with after building project (optional)

#Steps:
  1.)	Sign up for Telerik Platform on their 30 day free trial (no credit card required)
  
  2.)	Setup telerik workspace – go through tutorials or straight into it
  
  3.)	Install & configure JWT on local platform build
  
  a.	Go to web config file.
  
  b.	Modify this line:
  
    <add name="JWTAuth" type="Dnn.AuthServices.Jwt.Auth.JwtAuthMessageHandler, Dnn.AuthServices.Jwt" enabled="true" defaultInclude="false" forceSSL="false" />
  
  Set defaultInclude to true – this allows JWT to be activated in all of DNN’s web API’s.
  Set forceSSL to false – not all API’s support SSL, so we want to turn this off.
  
  *Note*: If testing via web based emulator instead of app – add these lines to web.config (around line 118) – this is to allow CORS (cross origin resource sharing) **THIS IS A SECURITY RISK
  Under this line - <remove name="X-Powered-By" />
  
    <add name="Access-Control-Allow-Origin" value="*" />
    <add name="Access-Control-Allow-Headers" value="accept, accept-language, content-type, accept, authorization, moduleid, tabid, x-dnn-moniker" />
    <add name="Access-Control-Allow-Methods" value="GET, POST, PUT, HEAD, OPTIONS" />
  
  4.)	Install SPA module on local build
  a.	Place on sample page
  
  b.	Create a record or two
  
  c.	Give it a moniker under module settings -> advanced
  
  d.	Give it the moniker “spamodulesample”
  
  5.)	Connect mobile app to local build by calling APIs using jQuery AJAX
  a.	Grab code from Sample App – index.html, main.css, contacts.js & app.js
  
  b.	Set up IIS bindings to allow local testing
  
  c.	If testing on app, you want to set up the IP address binding as well.
  
  d.	Login using url set up in IIS and see if API’s are accessed correctly
  
  6.)	Emulate / download app to test.

NOTE: You can also download the app on mobile phones by going into Run -> Build and this will download the app package. Alternatively, you can download the telerik app builder app to download the app directly using their QR scanner.

![Build Menu](https://raw.githubusercontent.com/dnnsoftware/Dnn.Platform.Samples.Mobile/master/images/build.png)
![Platform Options](https://raw.githubusercontent.com/dnnsoftware/Dnn.Platform.Samples.Mobile/master/images/platform.png)
