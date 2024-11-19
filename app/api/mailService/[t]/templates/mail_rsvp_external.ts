const template = `<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{eventName}} Registration Confirmation</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
       <div class="header" style="background: linear-gradient(45deg, #121212, #2c2c2c); background-color: #000000; color: white; background-repeat: no-repeat; background-size: cover; background-image: url(https://events.uck.ac.in/img/bg-mail.png); text-align: center; padding: 30px 0; padding-bottom: 60px; margin-bottom: 0; border-radius: 8px 8px 0 0;">
            
                       <img src="{{clubIcon}}" style="width:100px; border-radius: 4px;" alt="Club Logo">
            <h2>{{eventName}}</h2>
        </div>
      <div class="content" style="padding: 20px;">
        <h3>Hey {{userName}}! 👋</h3>
        <h4>
          We've received your initial RSVP request for <span style="font-weight: bold;">{{eventName}}</span>, but there's just one more step to complete the process. 🙌. Read below.
        </h4>
        <div class="event-poster" style="text-align: center; margin-bottom: 20px;">
          <img src="{{eventPoster}}" style="max-width: 100%; height: auto; border-radius: 4px;" alt="Event Poster" height="auto">
        </div>
        <h4>Here are the deets you need to know:</h4>
        <ul style="list-style: none; padding: 5px;">
          <li class="list" style="display: flex; align-items: center; margin-bottom: 10px; gap: 4px;">
            <img style="width: 20px;  margin-right: 1px;" src="https://icons.veryicon.com/png/o/miscellaneous/esgcc-basic-icon-library/date-71.png" alt="Event Poster">&nbsp;
            <strong>Date:</strong>&nbsp;
            {{eventDate}}
          </li>
          <li class="list" style="display: flex; align-items: center; margin-bottom: 10px; gap: 4px;">
            <img style="width: 17px; margin-right: 1px;" src="https://icons.veryicon.com/png/o/commerce-shopping/online-retailers/clock-136.png" alt="Event Poster">&nbsp;
            <strong>Time:</strong>&nbsp;
            {{eventTime}}&nbsp;
          </li>
          <li class="list" style="display: flex; align-items: center; margin-bottom: 10px; gap: 4px;">
            <img style="width: 20px; margin-right: 1px;" src="https://icons.veryicon.com/png/o/business/classic-icon/location-56.png" alt="Event Poster">&nbsp;
            <strong>Venue:</strong>&nbsp;
            {{eventVenue}}&nbsp;
          </li>
        </ul>
        <p>
          This event handles Registrations in an external site. So, it is crucial that you go to the below link and confirm your registration.
          <center>
            <a href="{{rsvpData.link}}" class="btn" style="background-color: #121212; color: #ffffff; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 20px 0;">Register Here</a>
          </center>
        </p>
        <p>
          Cheers!<br>
          {{clubName}}<br>
        </p>
      </div>
       <div class="footer" style="background-color: #f4f4f4; padding: 10px 0; text-align: center; border-radius: 0 0 8px 8px;">
            <small style="padding: 5px;">
                Powered by <a href="https://events.uck.ac.in" style="text-decoration: none; color: #000000;">
                    <div>
                        <img src="https://events.uck.ac.in/logos/logo_black.png" alt="Events@UCE" style="width: 30px; height: 30px; border-radius: 10%;">
                        <h4 style="margin: 0; padding: 0;">Events@UCE</h4>
                    </div>
                </a>
            </small>
        </div>
    </div>
  </body>
</html> `


export default template;