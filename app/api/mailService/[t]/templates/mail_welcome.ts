export default  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Events@UCEK!</title>
  <style>
    /* Add your custom styles here */
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='70' height='8' patternTransform='scale(2) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M-.02 22c8.373 0 11.938-4.695 16.32-9.662C20.785 7.258 25.728 2 35 2c9.272 0 14.215 5.258 18.7 10.338C58.082 17.305 61.647 22 70.02 22M-.02 14.002C8.353 14 11.918 9.306 16.3 4.339 20.785-.742 25.728-6 35-6 44.272-6 49.215-.742 53.7 4.339c4.382 4.967 7.947 9.661 16.32 9.664M70 6.004c-8.373-.001-11.918-4.698-16.3-9.665C49.215-8.742 44.272-14 35-14c-9.272 0-14.215 5.258-18.7 10.339C11.918 1.306 8.353 6-.02 6.002'  stroke-width='1' stroke='hsla(258.5,59.4%,59.4%,1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>");
      color: #000000;
      text-align: center;
      padding: 20px 0;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 20px;
    }
    .footer {
      background-color: #f4f4f4;
      padding: 10px 0;
      text-align: center;
      border-radius: 0 0 8px 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Hello there, {{userName}}! 👋</h2>
    </div>
    <div class="content">
      <h3>Welcome to Events@UCEK!</h3>
      <h4>
        Thank You for signing in. We're super excited (^_^) to have you on board at Events@UCEK - your ultimate source for all the lit happenings around campus! 🚀
      </h4>
      <div>
        <p>
          Whether it's a mind-bending lecture, a heart-pumping sports tournament, or a foot-tapping cultural extravaganza, Events@UCEK is your trusty companion to always be in the loop. 🗓️
        </p>
        <p>
          But wait, there's more! With Events@UCEK, you can easily RSVP for the events that catch your eye, securing your spot and getting hyped with your UCEK squad. Plus, you'll have a handy record of all the events you've attended, so you can reminisce about the epic memories you've created. 🎟️
        </p>
        <p>
          Get ready to dive into a world of endless possibilities, where new experiences await around every corner. Be sure to keep an eye on your inbox and the website for the latest event updates. 👀
        </p>        
        <p>
          Let's make the most of our time at UCEK and create some unforgettable moments together, fam! 🎉
          If you have any questions or need further assistance, please feel free to contact us at eventsatucek@gmail.com.
        </p>
        <p>
          Cheers to an eventful journey ahead!<br/>
          The Events@UCEK Crew
        </p>
      </div>
    </div>
    <div class="footer">
      <small style="padding: 5px;">
        This email was sent to {{userEmail}}. If you believe you received this email by mistake, please contact us.
      </small>
    </div>
  </div>
</body>
</html>
`