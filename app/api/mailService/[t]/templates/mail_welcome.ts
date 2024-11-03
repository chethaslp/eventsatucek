const template =  `<!DOCTYPE html>
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
      background-color: #000000;
      color: white;
      background-repeat: no-repeat;
      background-size: cover;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='600' height='100' preserveAspectRatio='none' viewBox='0 0 600 100'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1132%26quot%3b)' fill='none'%3e%3crect width='600' height='100' x='0' y='0' fill='rgba(46%2c 10%2c 55%2c 1)'%3e%3c/rect%3e%3cpath d='M610 100L0 100 L0 55.31Q17.61 42.92%2c 30 60.54Q45.37 45.91%2c 60 61.27Q79.59 30.87%2c 110 50.46Q141.02 31.48%2c 160 62.49Q172.59 45.09%2c 190 57.68Q211.93 29.61%2c 240 51.54Q260.8 42.34%2c 270 63.13Q279.51 42.64%2c 300 52.16Q330.93 33.09%2c 350 64.01Q366.07 50.09%2c 380 66.16Q397.4 33.56%2c 430 50.97Q458.71 29.69%2c 480 58.4Q504.75 33.15%2c 530 57.89Q554.77 32.66%2c 580 57.43Q591.78 39.21%2c 610 50.99z' fill='rgba(20%2c 42%2c 82%2c 1)'%3e%3c/path%3e%3cpath d='M630 100L0 100 L0 74.21Q22.92 47.13%2c 50 70.05Q63.61 53.66%2c 80 67.28Q97.38 54.66%2c 110 72.05Q127.33 59.38%2c 140 76.72Q161.91 48.63%2c 190 70.53Q203.28 53.81%2c 220 67.08Q238.06 55.14%2c 250 73.2Q264.81 58%2c 280 72.81Q299.85 42.66%2c 330 62.5Q347.25 49.75%2c 360 66.99Q380.1 57.09%2c 390 77.19Q415.01 52.21%2c 440 77.22Q448.16 55.38%2c 470 63.53Q484.37 47.89%2c 500 62.26Q522.11 54.37%2c 530 76.48Q556.05 52.53%2c 580 78.58Q598.17 46.75%2c 630 64.93z' fill='%2325467d'%3e%3c/path%3e%3cpath d='M620 100L0 100 L0 82.83Q27.39 60.22%2c 50 87.6Q72.64 60.23%2c 100 82.87Q114.19 67.06%2c 130 81.24Q152.38 53.61%2c 180 75.99Q212.68 58.66%2c 230 91.34Q250.41 61.75%2c 280 82.16Q309.91 62.07%2c 330 91.99Q344.59 76.58%2c 360 91.17Q377.92 59.09%2c 410 77Q428.74 65.73%2c 440 84.47Q464.68 59.15%2c 490 83.83Q506.94 70.78%2c 520 87.72Q540.8 58.52%2c 570 79.32Q599.49 58.81%2c 620 88.3z' fill='%23356cb1'%3e%3c/path%3e%3cpath d='M620 100L0 100 L0 97.3Q15.9 83.2%2c 30 99.1Q45.36 84.46%2c 60 99.82Q78.96 68.78%2c 110 87.73Q138.98 66.71%2c 160 95.69Q179.22 84.91%2c 190 104.14Q202.1 86.24%2c 220 98.34Q239.85 68.19%2c 270 88.04Q299 67.03%2c 320 96.03Q335.95 81.98%2c 350 97.93Q375.39 73.33%2c 400 98.72Q417.75 86.47%2c 430 104.21Q446.86 71.06%2c 480 87.92Q511.18 69.1%2c 530 100.28Q544.47 84.75%2c 560 99.22Q569.43 78.65%2c 590 88.08Q611 79.09%2c 620 100.09z' fill='white'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1132'%3e%3crect width='600' height='100' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
      text-align: center;
      padding: 30px 0;
      padding-bottom: 60px;
      margin-bottom: 0;
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
        <div style="display: flex; align-items: center; justify-content: center; ">
            <img src="https://events.ieeesbucek.in/logos/logo_white.png" alt="Events@UCEK" style="width: 40px; height: 40px; border-radius: 10%;"/>
            <img src="https://events.ieeesbucek.in/logos/logo_text.png" alt="Events@UCE" style="width: 130; border-radius: 10%;"/>
            <!-- <h4 style="margin: 0; padding: 0;">Events@UCEK</h4> -->
        </div>
        <h2>Hello there, {{userName}}! 👋</h2>
    </div>
    <div class="content">
      <h3>Welcome to Events@UCEK!</h3>
      <h4>
        Thank You for signing in. We're super excited (^_^) to have you on board at Events@UCEK - your ultimate source for all the lit happenings around campus! 🚀
      </h4>
      <div>
        <p>
          With Events@UCEK, you can easily RSVP for the events that catch your eye, securing your spot and getting hyped with your UCEK squad. Plus, you'll have a handy record of all the events you've attended, so you can reminisce about the epic memories you've created.
          Get ready to dive into a world of endless possibilities, where new experiences await around every corner.
        </p>        
        <p>
          Be sure to keep an eye on your inbox and the website for the latest event updates. 👀 
          Let's make the most of our time at UCEK and create some unforgettable moments together, fam! 🎉
        </p>
        <p>
          Cheers to an eventful journey ahead!<br/>
          The Events@UCEK Crew
        </p>
      </div>
    </div>
    <div class="footer">
      <small style="padding: 5px;">
          Powered by <a href="https://events.ieeesbucek.in" style="text-decoration: none; color: #000000;">
        <div style="display: flex; align-items: center; margin-top: 5px; justify-content: center; gap: 5px;">
            <img src="https://events.ieeesbucek.in/logos/logo_black.png" alt="Events@UCE" style="width: 30px; height: 30px; border-radius: 10%;"/>
            <h4 style="margin: 0; padding: 0;">Events@UCE</h4>
        </div>
        </a>
      </small>
    </div>
  </div>
</body>
</html>
`

export default template;