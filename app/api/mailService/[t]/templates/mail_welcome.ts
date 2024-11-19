const template =  `<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Events@UCEK!</title>
</head>

<body style="font-family: Arial, sans-serif;background-color: #f4f4f4;margin: 0;padding: 0;">
    <div class="container" style="max-width: 600px;margin: 0 auto;padding: 20px;background-color: #fff;border-radius: 8px;box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
        <div class="header" style="background-color: #000000;color: white;background-repeat: no-repeat;background-size: cover;background-image: url(https://events.uck.ac.in/img/bg-mail.png);text-align: center;padding: 30px 0;padding-bottom: 60px;margin-bottom: 0;border-radius: 8px 8px 0 0;">
            
            <table style="margin: 0 auto;">
                <tr>
                    <td style="vertical-align: middle; padding-right: 10px;">
                        <img src="https://events.uck.ac.in/logos/logo_white.png" alt="Events@UCEK" style="width: 40px; height: 40px; border-radius: 10%;">
                    </td>
                    <td style="vertical-align: middle;">
                        <img src="https://events.uck.ac.in/logos/logo_text.png" alt="Events@UCE" style="width: 130px; height: 20px; border-radius: 10%;">
                    </td>
                </tr>
            </table>
            <h2>Hello there, {{userName}}! 👋</h2>
        </div>
        <div class="content" style="padding: 20px;">
            <h3>Welcome to Events@UCEK!</h3>
            <h4>
                Thank You for signing in. We're super excited (^_^) to have you on board at Events@UCEK - your ultimate
                source for all the lit happenings around campus! 🚀
            </h4>
            <div>
                <p>
                    With Events@UCEK, you can easily RSVP for the events that catch your eye, securing your spot and
                    getting hyped with your UCEK squad. Plus, you'll have a handy record of all the events you've
                    attended, so you can reminisce about the epic memories you've created.
                    Get ready to dive into a world of endless possibilities, where new experiences await around every
                    corner.
                </p>
                <p>
                    Be sure to keep an eye on your inbox and the website for the latest event updates. 👀
                    Let's make the most of our time at UCEK and create some unforgettable moments together, fam! 🎉
                </p>
                <p>
                    Cheers to an eventful journey ahead!<br>
                    The Events@UCEK Crew
                </p>
            </div>
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

</html>
`

export default template;