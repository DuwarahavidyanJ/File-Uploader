let emailEle = document.querySelector('.email');
        let verfEle = document.querySelector('.verification');
        let successEle = document.querySelector('.success');
        let errorEle = document.querySelector('.error');
        let otp_inputs = document.querySelectorAll('.otp_num');
        let emailpartialEle = document.querySelector('.emailpartial');
        let regex = new RegExp('[a-zA-Z0-9]+@[a-z]+\.[a-z]{2,3}');
        let otp_check = '';
        let email;

        otp_inputs.forEach(
            (ip) => {
                ip.addEventListener('keyup', moveNext)
            }
        )

        function moveNext(event) {
            // otp_num_4

            let current = event.target;
            let index = current.classList[1].slice(-1);
            if (event.keyCode == 8 && index > 1) {
                current.previousElementSibling.focus()
            }
            else if (index < 4) {
                current.nextElementSibling.focus()

            }
            otp_check = '';
            for (ip of otp_inputs) {
                otp_check += ip.value
            }
            if (otp_check.length == 4) {
                verifyOTP()
            }





        }

        function verifyOTP() {
            fetch('http://localhost:5000/verify',
                {
                    method: "POST",
                    body: JSON.stringify({
                        "email": `${email}`,
                        "otp": `${otp_check}`
                    }),
                    headers: { 'Content-Type': 'application/json' }


                }
            )
                .then(
                    (res) => { // once verified otp blocks will disapppear 
                        console.log(res)
                        if (res.status == 200) {
                            window.location.href = 'o.html';
                            
                        }
                        else {
                            errorEle.style.display = 'block';
                            errorEle.innerHTML = "Invalid OTP";
                            successEle.style.display = 'none';

                        }
                    }
                )

        }



        function sendOTP() {
            email = emailEle.value;
            if (regex.test(email)) {
                fetch('http://localhost:5000/sendotp', {
                    method: "POST",
                    body: JSON.stringify({
                        "email": `${email}`
                    }),
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(
                        (res) => {
                            if (res.status == 200) {
                                verfEle.style.display = 'block'; //when email is ok then only this diplayed
                                emailpartialEle.value = "***" + email.slice(3)
                                // emailEle.value = ''
                            }
                            else {
                                errorEle.style.display = 'block';
                                errorEle.innerHTML = "Email not exist";
                                successEle.style.display = 'none';

                            }
                        }
                    )

            }
            else {
                errorEle.style.display = 'block';
                errorEle.innerHTML = "Invalid Email";
                successEle.style.display = 'none';

            }

        }
