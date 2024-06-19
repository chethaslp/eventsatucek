const template =  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{eventName}} Registration Confirmation</title>
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
        background-color: #5C427C;
        background: linear-gradient(45deg, #121212, #2c2c2c);
        color: #fff;
        text-align: center;
        padding: 20px 0;
        border-radius: 8px 8px 0 0;
      }
      .content {
        padding: 20px;
      }
      .event-poster {
        text-align: center;
        margin-bottom: 20px;
      }
      .event-poster img {
        max-width: 100%;
        height: auto;
      }
      .footer {
        background-color: #f4f4f4;
        padding: 10px 0;
        text-align: center;
        border-radius: 0 0 8px 8px;
      }
      .icon {
        width: 17px;
      }
      .list{
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        gap: 4px;
      }
      ul{
        list-style: none;
        padding:5px
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="{{clubIcon}}" style="border-radius: 4px;" alt="Club Logo" />
      </div>
      <div class="content">
        <h3>Hey {{userName}}! 👋</h3>
        <h4>
          We've got some exciting news – your RSVP for {{eventName}} has been confirmed! 🙌.
        </h4>
        <div class="event-poster">
          <img src="{{eventPoster}}" style="border-radius: 4px;" alt="Event Poster" />
        </div>
        <h4>Here are the deets you need to know:</h4>
        <ul >
          <li class="list">
            <img style="width: 20px;  margin-right: 1px;" src="https://icons.veryicon.com/png/o/miscellaneous/esgcc-basic-icon-library/date-71.png" alt="Event Poster" />&nbsp;
            <strong>Date:</strong>&nbsp;
            {{eventDate}}
          </li>
          <li class="list">
            <img style="width: 17px; margin-right: 1px;" src="https://icons.veryicon.com/png/o/commerce-shopping/online-retailers/clock-136.png" alt="Event Poster" />&nbsp;
            <strong>Time:</strong>&nbsp;
            {{eventTime}}&nbsp;
          </li>
          <li class="list">
            <img style="width: 20px; margin-right: 1px;" src="https://icons.veryicon.com/png/o/business/classic-icon/location-56.png" alt="Event Poster" />&nbsp;
            <strong>Venue:</strong>&nbsp;
            {{eventVenue}}&nbsp;
          </li>
        </ul>
        <p>
        {{#if rsvpData.rsvp.custom_text != "" }}
        {{#ifEquals rsvpData.rsvp.custom_text ""}}
          Mark your calendars and get hyped, because this event is gonna be off the charts! 🚀 We'll be sending out more updates as we get closer to the date, so keep an eye on your inbox. 👀
          Can't wait to see you there and make some epic memories together! 🥳 If you have any questions
          or need further assistance, feel free to contact us.
        {{ else }}
          {{rsvpData.rsvp.custom_text}}
         {{/ifEquals}}
        </p>
        <p>
          Cheers!<br />
          The Events@UCEK Crew
        </p>
      </div>
      <div class="footer">
        <small style="padding: 5px;">
          This email was sent to {{userEmail}}. If you believe you received this
          email by mistake, please contact us.
        </small>
      </div>
    </div>
  </body>
</html>
`


export default template;