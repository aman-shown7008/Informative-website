document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll("header a");
  const currentPath = window.location.pathname;

  function getFileName(path) {
    return path.substring(path.lastIndexOf("/") + 1);
  }

  links.forEach((link) => {
    const linkPath = link.getAttribute("href");

    if (linkPath) {
      const currentFileName = getFileName(currentPath);
      const linkFileName = getFileName(linkPath);

      // Compare the filenames only
      if (currentFileName === linkFileName) {
        link.style.backgroundColor = "black";
        link.style.color = "white";
        link.style.borderRadius = "3px";
      }
    }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const enquiryForm = document.getElementById("enquiryForm");

  if (enquiryForm) {
    enquiryForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var thankYouModal = new bootstrap.Modal(
        document.getElementById("thankYouModal")
      );
      thankYouModal.show();
    });
  }
});


// Conatct Us
document.addEventListener("DOMContentLoaded", function () {
  function manageCheckboxGroup(groupName) {
    const checkboxes = document.querySelectorAll(`input[name="${groupName}"]`);

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        if (this.checked) {
          checkboxes.forEach((otherCheckbox) => {
            if (otherCheckbox !== this) {
              otherCheckbox.checked = false;
            }
          });
        }
      });
    });
  }

  manageCheckboxGroup("personalization");

  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const checkboxes = document.querySelectorAll('input[name="personalization"]');
      let personalization = "";
      checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          const label = document.querySelector(`label[for="${checkbox.id}"]`);
          if (label) {
            personalization += label.textContent.trim() + " ";
          }
        }
      });
      personalization = personalization.trim();

      let timing = "";
      const timingCheckboxes = document.querySelectorAll('input[name="timing"]');
      timingCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          const label = document.querySelector(`label[for="${checkbox.id}"]`);
          if (label) {
            timing = label.textContent.trim();
          }
        }
      });

      const specificDate = document.querySelector('input[type="date"]').value;

      const formData1 = {
        description: document.getElementById("messages").value,
        personalization: personalization || null,
        engravedText: document.getElementById("engravedText").value,
        timing: timing || null,
        specificDate: specificDate || null,
        fullName: document.getElementById("name").value,
        email: document.getElementById("emails").value,
        mobileNo: document.getElementById("phoneno").value,
        postalCode: document.getElementById("postal-code").value,
        // message:"I will provide the logo soon and need the product by the specific date if provided.",
      };

      fetch("http://44.217.231.24:5002/api/ContactUs/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData1),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data || data._id) {
            Toastify({
              text: "Thank you! Your form submission has been received.",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "right",
              backgroundColor: "#4CAF50",
            }).showToast();

            document.getElementById("contactForm").reset();
          } else {
            throw new Error("Submission failed");
          }
        })
        .catch((error) => {
          Toastify({
            text: "Something went wrong.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#FF0000",
          }).showToast();
        });
    });
  }

  const reviewForm = document.getElementById("reviewForm");

  if (reviewForm) {
    reviewForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const reviewMess = document.getElementById("messages").value;

      if(reviewMess.length > 100){
        const errorMessage = document.querySelector(".review-error");
        if(!errorMessage){
          const errorParagrapth = document.createElement("p");
          errorParagrapth.innerText = "You can add only a maximum of 100 characters.";
          errorParagrapth.className = 'review-error';
          errorParagrapth.style.color = 'red';
          document.getElementById("messages").parentElement.appendChild(errorParagrapth);
        }
        return;
      }else {
        const existingError = document.querySelector(".review-error");
        if (existingError) {
          existingError.remove(); 
        }
      }

      // console.log("Come Here");
      const submitButton = reviewForm.querySelector('button[type="submit"]');
      const originalText = submitButton.innerText;
  
      submitButton.innerText = "Your review is sending...";
      submitButton.disabled = true; 

      const formData = new FormData();
      const fileInput = document.getElementById("fileUpload");
      // console.log(fileInput.files[0]);
      formData.append("review", document.getElementById("messages").value);
      formData.append("testimonial", document.getElementById("name").value);
      formData.append("rating", document.getElementById("rating").value);
      if(fileInput.files.length > 0){
        formData.append("images", fileInput.files[0]);
      }
      fetch("http://44.217.231.24:5002/api/testimonial/add", {
        method: "POST",
        body: formData, 
      })
      .then((response) => response.json())
        .then((data) => {
          if (data || data._id) {
            Toastify({
              text: "Thank you! Your form submission has been received.",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "right",
              backgroundColor: "#4CAF50",
            }).showToast();

            document.getElementById("reviewForm").reset();
            resetStarRating();
          } else {
            throw new Error("Submission failed");
          }
        })
        .catch((error) => {
          Toastify({
            text: "Something went wrong.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#FF0000",
          }).showToast();
        })
        .finally(() => {
          submitButton.innerText = originalText;
          submitButton.disabled = false;
        });
    });
  }

  function resetStarRating() {
    const stars = document.querySelectorAll("#star-rating .star");
    stars.forEach((star) => {
      star.style.color = "gray";
    });
  }
  const stars = document.querySelectorAll("#star-rating .star");
  stars.forEach((star) => {
    star.addEventListener("click", function () {
      const value = this.getAttribute("data-value");
      document.getElementById("rating").value = value;
      stars.forEach((s) => {
        stars.forEach((s) => {
          s.style.color = s.getAttribute("data-value") <= value ? "gold" : "gray";
        });
      });
    });
  });
});


// Enquiry Form - Need Change
document.addEventListener("DOMContentLoaded", function () {
  // Function to ensure only one checkbox is selected per group
  function manageCheckboxGroup(groupName) {
    const checkboxes = document.querySelectorAll(`input[name="${groupName}"]`);

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        if (this.checked) {
          checkboxes.forEach((otherCheckbox) => {
            if (otherCheckbox !== this) {
              otherCheckbox.checked = false; // Uncheck others
            }
          });
        }
      });
    });
  }

  // Apply the function to both checkbox groups
  manageCheckboxGroup("personalization");
  manageCheckboxGroup("timing");

  // Form submission logic
  const enquiryForm = document.getElementById("enquiryForm");

  if (enquiryForm) {
    enquiryForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Capture the checkbox label for personalization
      const checkboxes = document.querySelectorAll(
        'input[name="personalization"]'
      );
      let personalization = "";
      checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          const label = document.querySelector(`label[for="${checkbox.id}"]`);
          if (label) {
            personalization += label.textContent.trim() + " ";
          }
        }
      });
      personalization = personalization.trim();

      // Capture the checkbox label for timing
      let timing = "";
      const timingCheckboxes = document.querySelectorAll(
        'input[name="timing"]'
      );
      timingCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          const label = document.querySelector(`label[for="${checkbox.id}"]`);
          if (label) {
            timing = label.textContent.trim();
          }
        }
      });

      // Capture the specific date if selected
      const specificDate = document.querySelector('input[type="date"]').value;

      // Prepare the form data for submission
      const formData1 = {
        description: document.getElementById("messages").value,
        personalization: personalization || null,
        engravedText: document.getElementById("engravedText").value,
        timing: timing || null,
        specificDate: specificDate || null,
        fullName: document.getElementById("name").value,
        email: document.getElementById("emails").value,
        mobileNo: document.getElementById("phoneno").value,
        postalCode: document.getElementById("postal-code").value,
        // message:"I will provide the logo soon and need the product by the specific date if provided.",
      };

      // Send the POST request with the form data
      fetch("http://44.217.231.24:5002/api/enquiry/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData1),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data._id) {
            // Reset form fields including checkboxes after successful submission
            document.getElementById("enquiryForm").reset(); // Reset the form
            checkboxes.forEach((checkbox) => (checkbox.checked = false)); // Uncheck all checkboxes
            timingCheckboxes.forEach((checkbox) => (checkbox.checked = false));
          } else {
            throw new Error("Submission failed");
          }
        })
        .catch((error) => {
          document.getElementById("enquiryForm").reset(); // Reset the form
          checkboxes.forEach((checkbox) => (checkbox.checked = false)); // Uncheck all checkboxes
          timingCheckboxes.forEach((checkbox) => (checkbox.checked = false)); // Uncheck all timing checkboxes
        });
    });
  }
});


// Product-Query Form
document.addEventListener("DOMContentLoaded", function () {
  function manageCheckboxGroup(groupName) {
    const checkboxes = document.querySelectorAll(`input[name="${groupName}"]`);

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        if (this.checked) {
          checkboxes.forEach((otherCheckbox) => {
            if (otherCheckbox !== this) {
              otherCheckbox.checked = false;
            }
          });
        }
      });
    });
  }

  manageCheckboxGroup("personalization");
  manageCheckboxGroup("timing");

  const rfqForm = document.getElementById("rfqForm");

  if (rfqForm) {
    rfqForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const product = JSON.parse(sessionStorage.getItem("selectedProduct"));
      const productName = product ? product.productname : ''; 

      // Capture the checkbox label for personalization
      const personalizationCheckboxes = document.querySelectorAll('input[name="personalization"]');
      let personalization = "";
      personalizationCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          const label = document.querySelector(`label[for="${checkbox.id}"]`);
          if (label) {
            personalization = label.textContent.trim();
          }
        }
      });

      // Capture the checkbox label for timing
      let timing = "";
      const timingCheckboxes = document.querySelectorAll('input[name="timing"]');
      timingCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          const label = document.querySelector(`label[for="${checkbox.id}"]`);
          if (label) {
            timing = label.textContent.trim();
          }
        }
      });

      const specificDate = document.querySelector('input[type="date"]').value;

      const formData = {
        productName: productName,
        description: document.getElementById("messages").value,
        personalization: personalization || null,
        engravedText: document.getElementById("engravedText").value,
        timing: timing || null,
        specificDate: specificDate || null,
        fullName: document.getElementById("name").value,
        email: document.getElementById("emails").value,
        mobileNo: document.getElementById("phoneno").value,
        postalCode: document.getElementById("postal-code").value,
        // message:"I will provide the logo soon and need the product by the specific date if provided.",
      };
      // console.log(formData);
      fetch("http://44.217.231.24:5002/api/productenquiry/add", {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify(formData),
      }).then((response) => response.json()).then((data) => {
          if (data._id) {
            document.getElementById("rfqForm").reset();
          } else {
            throw new Error("Submission failed");
          }
        })
        .catch((error) => {
          // console.error("Error:", error);
        });
    });
  }
});


// Testimonial Section
document.addEventListener("DOMContentLoaded", function () {
  const apiEndpoint = "http://44.217.231.24:5002/api/testimonial/";
  const testimonialsContainer = document.querySelector(".testimonials-section");
  const ratingElement = document.querySelector(".position-abs-test b");

  fetch(apiEndpoint)
    .then((response) => response.json())
    .then((data) => {
      if(data.averageRating){
        ratingElement.textContent = `${data.averageRating}`
      }
     
      const testimonials = data.testimonials;
      let toggle = true;

      testimonials.forEach((testimonial) => {
        if (testimonial.approved) { 
          const testimonialContainer = document.createElement("div");
          testimonialContainer.className = `testimonial-container ${toggle ? "left" : "right"}`;
          toggle = !toggle;

          const testimonialDiv = document.createElement("div");
          testimonialDiv.className = "testimonial t-col";

          const testimonialContent = document.createElement("div");
          testimonialContent.className = "testimonial-content";

          const testimonialText = document.createElement("p");
          testimonialText.textContent = `"${testimonial.testimonial}"`;

          const testimonialImage = document.createElement("img");
          testimonialImage.src = testimonial.image.length > 0 ? testimonial.image : "/assets/images/ImageNotFound.png"; 
          testimonialImage.alt = "Customer";
          testimonialImage.className = "testi-img";
          // console.log("Image source:", testimonialImage.src);


          const ratings = document.createElement("p");
          ratings.className = "ratings-star";
          ratings.innerHTML = "Star Rating: " + "⭐".repeat(testimonial.rating);

          const reviews = document.createElement("p");
          reviews.className = "review-page";
          const trunReview = testimonial.review.length > 100 ? testimonial.review.substring(0, 100) + "..." : testimonial.review
          reviews.innerHTML = "Review: " + `"${trunReview}"`;

          // Append elements
          testimonialContent.appendChild(testimonialText);
          testimonialContent.appendChild(testimonialImage);
          testimonialDiv.appendChild(ratings);
          testimonialDiv.appendChild(reviews);
          testimonialDiv.appendChild(testimonialContent);
          testimonialContainer.appendChild(testimonialDiv);
          testimonialsContainer.appendChild(testimonialContainer);
        }
      });
    })
    .catch((error) => {
      // console.error("Error fetching testimonials:", error);
    });
});


//FAQ Section
document.addEventListener("DOMContentLoaded", function () {
  const apiEndpoint = "http://44.217.231.24:5002/api/faq/";
  const faqContainer = document.querySelector(".faq-container");

  fetch(apiEndpoint)
    .then((resp) => resp.json())
    .then((data) => {
      data.sort((a, b) => Number(a.sequence) - Number(b.sequence));

      data.forEach((item) => {
        const faqItem = document.createElement("div");
        faqItem.className = "faq-item";
        faqItem.setAttribute("onClick", "toggleAnswer(this)");

        const quesDiv = document.createElement("div");
        quesDiv.className = "question";
        quesDiv.textContent = item.question;

        const arrowSpan = document.createElement("span");
        arrowSpan.className = "arrow";
        arrowSpan.textContent = "▼";

        quesDiv.appendChild(arrowSpan);

        const answerDiv = document.createElement("div");
        answerDiv.className = "answer";

        const answerP = document.createElement("p");
        answerP.className = "thin-text";
        answerP.textContent = item.answer;

        answerDiv.appendChild(answerP);

        faqItem.appendChild(quesDiv);
        faqItem.appendChild(answerDiv);
        faqContainer.appendChild(faqItem);
      });
    })
    .catch((error) => {
      // console.log(error);
    });
});


function toggleAnswer(element) {
  const ansDiv = element.querySelector(".answer");
  if (ansDiv.style.display === "Block") {
    ansDiv.style.display = "none";
  } else {
    ansDiv.style.display = "block";
  }
}


//Category-section
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://44.217.231.24:5002/api/category/")
    .then((response) => response.json())
    .then((data) => {
      data.sort((a, b) => a.sequence - b.sequence);
      const categoryGrid = document.querySelector(".category-carousel");
      categoryGrid.innerHTML = "";

      sessionStorage.setItem("fetchedCategory", JSON.stringify(data));
      data.forEach((category) => {
        const categoryElement = document.createElement("div");
        categoryElement.classList.add("item", "addBack");

        const fullDescription = category.description;
        const truncatedDescription = category.description.length > 145 ? category.description.substring(0, 145) + "..." : category.description;

        const truncatedName = category.name.length > 50 ? category.name.substring(0, 50) + "..." : category.name;

        const formattedDescription = truncatedDescription.split(" ").map((word) => {
          if (word.length > 25) {
            return word.match(/.{1,25}/g).join(" ");
          }
          return word;
        }).join(" ");

        const formattedName = truncatedName.split(" ").map((word) => {
            if (word.length > 20) {
              return word.match(/.{1,18}/g).join(" ");
            }
            return word;
        }).join(" ");  

        // if(formattedName === "⭐️ Cigars & Smoker Accessories"){
        //   document.querySelector(".contain").style.backgroundImage = "url(./assets/images/Cigars_img.png)";
        //   document.querySelector(".contain").style.backgroundSize = "cover";
        //   document.querySelector(".contain").style.backgroundPosition = "center";
        // }

        const encodedCategory = encodeURIComponent(JSON.stringify(category));
        // console.log(formattedName);
        if (formattedName === "⭐️ Wedding, Union & Celebration Gifts") {
          categoryElement.innerHTML = `
            <div class="img1 custom-hover-container">
              <img src="${category.image}" alt="${category.name}" onerror="this.onerror=null;this.src='./assets/images/ImageNotFound.png';" class="card-img-top" />
              <div class="hover-left d-none">
                <a href="../products-pages/Wedding-celebration-gifts.html" class="groomsman-link groom-link details-button"  data-category='${encodedCategory}'>Groomsman Party Gifts</a>
              </div>
              <div class="hover-right d-none">
                <a href="../pages/contact.html" class="bridal-link groom-link">Bridal Party & Guest Gifts</a>
              </div>
            </div>
            <div class="inner-content">
              <h3 class="addh3">${formattedName}</h3>
              <p class="thin-text1 addp">
                <span class="description-text">${formattedDescription}</span>
                <span class="full-description" style="display: none;">${fullDescription}</span>
                ${
                  fullDescription.length > 150
                    ? `<a href="#" class="toggle-description">See More</a>`
                    : ""
                }
              </p>
              <a href="" class="detail-button" data-category='${encodedCategory}'>
                <button class="pt-2 button-more">More Info
                  <svg class="ps-2" width="30" height="12" viewBox="0 0 26 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.921997 6.98045H23.1524L16.6282 1.42285" stroke="white" stroke-width="1.58789"/>
                  </svg>
                </button>
              </a>
            </div>
          `;

          categoryElement.querySelector(".button-more").addEventListener("click", (e) => {
            e.preventDefault();
            const weddingCategory = data.filter((cat) => cat.name === "⭐️ Wedding, Union & Celebration Gifts");
            sessionStorage.setItem("selectedWeddingCategory", JSON.stringify(weddingCategory));
            window.location.href = "../products-pages/Wedding-celebration-gifts.html";
          });
        } else {
          categoryElement.innerHTML = `
          <div class="img1">
            <img src="${category.image}" alt="${category.name}" onerror="this.onerror=null;this.src='./assets/images/ImageNotFound.png';">
          </div>
          <div class="inner-content">
            <h3 class="addh3">${formattedName}</h3>
            <p class="thin-text1 addp">
              <span class="description-text">${formattedDescription}</span>
              <span class="full-description" style="display: none;">${fullDescription}</span>
              ${fullDescription.length > 150? `<a href="#" class="toggle-description">See More</a>`: ""}
            </p>
            <a href="" class="details-button" data-category='${encodedCategory}'>
              <button class="pt-2">More Info
                <svg class="ps-2" width="30" height="12" viewBox="0 0 26 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.921997 6.98045H23.1524L16.6282 1.42285" stroke="white" stroke-width="1.58789"/>
                </svg>
              </button>
            </a>
          </div>
        `;
        }
        categoryGrid.appendChild(categoryElement);
      });

      $(".category-carousel").owlCarousel({
        loop: false,
        margin: 20,
        nav: true,
        navText: ["←", "→"],
        responsive: {
          0: {
            items: 1,
            nav: false,
            stagePadding: 10,
          },
          576: {
            items: 2,
          },
          768: {
            items: 2,
            margin: 15,
          },
          992: {
            items: 3,
            margin: 20,
          },
          1200: {
            items: 3,
          },
        },
        onInitialized: function (event) {
          adjustActiveItems();
        },
        onChanged: function (event) {
          adjustActiveItems();
        },
      });

      function adjustActiveItems() {
        $(".owl-item").css({
          width: "calc(100% / 3 - 20px)",
          margin: "0 0 20px 0",
        });
      }

      function adjustActiveItems() {
        $(".owl-item").css({
          width: "360px",
          margin: "0 0 20px 0",
        });
      }

      document.querySelectorAll(".details-button").forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          const categoryData = JSON.parse(decodeURIComponent(e.currentTarget.getAttribute("data-category")));
          sessionStorage.setItem("selectedCategory",JSON.stringify(categoryData));
          fetchProductsByCategory(categoryData._id);
        });
      });

      document.querySelectorAll(".toggle-description").forEach((toggle) => {
        toggle.addEventListener("click", (e) => {
          e.preventDefault();
          const descriptionText =
            e.target.previousElementSibling.previousElementSibling;
          const fullDescription = e.target.previousElementSibling;

          if (descriptionText.style.display === "none") {
            descriptionText.style.display = "inline";
            fullDescription.style.display = "none";
            e.target.textContent = "See More";
          } else {
            descriptionText.style.display = "none";
            fullDescription.style.display = "inline";
            e.target.textContent = "See Less";
          }
        });
      });

      document.querySelectorAll(".toggle-description").forEach((toggle) => {
        toggle.style.color = "white";
      });
    })
    .catch((error) => {
      // console.error("Error fetching categories:", error);
    });
});


document.addEventListener("DOMContentLoaded", () => {
  const storedData = sessionStorage.getItem("fetchedLeafData");
  if (!storedData) {
    // console.error("No data found in sessionStorage for 'fetchedLeafData'");
    return;
  }

  const data = JSON.parse(storedData);
  const categoryGrid = document.querySelector(".category-carousel1");
  categoryGrid.innerHTML = "";
  
  const categoryElement = document.createElement("div");
  categoryElement.classList.add("item", "addBack");

  const fullDescription = data.description;
  const truncatedDescription = data.description.length > 145 ? data.description.substring(0, 145) + "..." : data.description;
  const truncatedName = data.name.length > 50 ? data.name.substring(0, 50) + "..." : data.name;
  
  const formattedDescription = truncatedDescription.split(" ").map((word) => {
    if (word.length > 25) {
      return word.match(/.{1,25}/g).join(" ");
    }
    return word;
  }).join(" ");

  const formattedName = truncatedName.split(" ").map((word) => {
    if (word.length > 20) {
      return word.match(/.{1,18}/g).join(" ");
    }
    return word;
  }).join(" ");  

  const encodedCategory = encodeURIComponent(JSON.stringify(data));


  categoryElement.innerHTML = `
    <div class="img1">
      <img src="${data.image[0]}" alt="${data.name}" onerror="this.onerror=null;this.src='./assets/images/ImageNotFound.png';">
    </div>
    <div class="inner-content">
      <h3 class="addh3">${formattedName}</h3>
      <p class="thin-text1 addp">
        <span class="description-text">${formattedDescription}</span>
        <span class="full-description" style="display: none;">${fullDescription}</span>
        ${fullDescription.length > 150 ? `<a href="#" class="toggle-description">See More</a>` : ""}
      </p>
      <a href="" class="details-button" data-category='${encodedCategory}'>
        <button class="pt-2">More Info
          <svg class="ps-2" width="30" height="12" viewBox="0 0 26 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.921997 6.98045H23.1524L16.6282 1.42285" stroke="white" stroke-width="1.58789"/>
          </svg>
        </button>
      </a>
    </div>`;
  
  categoryGrid.appendChild(categoryElement);

  $(".category-carousel1").owlCarousel({
    loop: false,
    margin: 20,
    nav: true,
    navText: ["←", "→"],
    responsive: {
      0: {
        items: 1,
        nav: false,
        stagePadding: 10,
      },
      576: {
        items: 2,
      },
      768: {
        items: 2,
        margin: 15,
      },
      992: {
        items: 3,
        margin: 20,
      },
      1200: {
        items: 3,
      },
    },
    onInitialized: function (event) {
      adjustActiveItems();
    },
    onChanged: function (event) {
      adjustActiveItems();
    },
  });

  function adjustActiveItems() {
    $(".owl-item").css({
      width: "calc(100% / 3 - 20px)",
      margin: "0 0 20px 0",
    });
  }

  document.querySelector(".details-button").addEventListener("click", (e) => {
    e.preventDefault();
    // const categoryData = JSON.parse(decodeURIComponent(e.currentTarget.getAttribute("data-category")));
    sessionStorage.setItem("selectedCategory", JSON.stringify(data));
    fetchProductsByCategory("67167670efcb5e5d2c75cba7");
  });
  

  document.querySelectorAll(".toggle-description").forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const descriptionText = e.target.previousElementSibling.previousElementSibling;
      const fullDescription = e.target.previousElementSibling;

      if (descriptionText.style.display === "none") {
        descriptionText.style.display = "inline";
        fullDescription.style.display = "none";
        e.target.textContent = "See More";
      } else {
        descriptionText.style.display = "none";
        fullDescription.style.display = "inline";
        e.target.textContent = "See Less";
      }
    });
  });

  document.querySelectorAll(".toggle-description").forEach((toggle) => {
    toggle.style.color = "white";
  });
});


//Wedding-page
document.addEventListener("DOMContentLoaded", () => {
  const weddingCategory = JSON.parse(sessionStorage.getItem("selectedWeddingCategory"));
  const categoryHead = document.querySelector(".cate-third h2");

  if (weddingCategory && weddingCategory.length > 0) {
    const categoryGrid = document.querySelector(".category-carousels");
    categoryGrid.innerHTML = "";

    weddingCategory.forEach((category) => {
      const categoryElement = document.createElement("div");
      categoryElement.classList.add("item");

      const encodedCategory = encodeURIComponent(JSON.stringify(category));
      categoryElement.innerHTML = `
        <div class="img1 custom-hover-container">
          <img src="${category.image}" alt="${category.name}" onerror="this.onerror=null;this.src='./assets/images/ImageNotFound.png';" class="wedd-img-top" />
          <div class="hover-left">
            <p class="links-gif">Select Here... See Great Options</p>
            <a href="/products-pages/Cigar-Product.html" class="groomsman-link groom-link details-button" data-category='${encodedCategory}'>Groomsman Party Gifts</a>
          </div>
          <div class="hover-right">
            <p class="links-gif">Select Here... Describe Your Needs</p>
            <a href="../pages/contact.html" class="bridal-link groom-link">Bridal Party & Guest Gifts</a>
          </div>
      </div>`;
        
      categoryElement.querySelector(".groomsman-link").addEventListener("click", (e) => {
        e.preventDefault();
        const categoryData = JSON.parse(decodeURIComponent(e.currentTarget.getAttribute("data-category")));
        sessionStorage.setItem("selectedCategory",JSON.stringify(categoryData));
        // fetchProductsByCategory(categoryData._id);
        fetchWeddingProduct("675c5d367a1e8ece700258c7");
        window.location.href = "../SubProduct/SubProduct.html";
      });
      categoryGrid.appendChild(categoryElement);
    });

    // Add 'More Info' event listeners
    // document.querySelectorAll(".details-button").forEach((button) => {
    //   button.addEventListener("click", (e) => {
    //     e.preventDefault();
    //     const categoryData = JSON.parse(button.getAttribute("data-category"));
    //     sessionStorage.setItem("selectedCategory", JSON.stringify(categoryData));
    //     fetchProductsByCategory(categoryData._id);
    //   });
    // });
  }
});

function fetchWeddingProduct(id){
    const productSection = document.querySelector(".subproduct-section .row");
    const heroSection = document.querySelector(".hero-sections .d-grid");
    // const selectedProduct = JSON.parse(sessionStorage.getItem("selectedSubProduct"));
    const maxInitialItems = 8;
    let showAllItems = false;
    console.log("Working Wedding2");
  
    if (!selectedProduct || !selectedProduct._id) {
      return;
    }
    // console.log("hello wedding");
    // const subCategoryId = selectedProduct._id;
    // console.log(alert("hello"));
  
    const apiUrl = `http://44.217.231.24:5002/api/subcategory/${id}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const products1 = data.products;
  
          heroSection.querySelector("h1").textContent = selectedProduct.subCategoryname;
          heroSection.querySelector("p").textContent = selectedProduct.description;
        
  
        if (products1 && products1.length > 0) {
          renderProducts(products1);
        } else {
          noProductFound();
        }
      })
      .catch((error) => {
        // console.error("Error fetching products by subcategory:", error);
      });
  
    const renderProducts = (products1) => {
      if (!productSection) {
        return;
      }
  
      productSection.innerHTML = "";
  
      const itemToShow = showAllItems ? products1.length : maxInitialItems;
      products1.slice(0, itemToShow).forEach((product) => {
        const productElement = document.createElement("div");
        productElement.classList.add("col-lg-3", "col-md-4", "col-sm-6", "mb-4");
  
        const truncatedName =
          product.productname.length > 60
            ? product.productname.substring(0, 60) + "..."
            : product.productname;
        const truncatedDesc =
          product.description.length > 100
            ? product.description.substring(0, 100) + "..."
            : product.description;
  
        productElement.innerHTML = `
          <a href="../rfq/products-1-rfq.html">
            <div class="card clickable-card">
              <img src="${product.image[0]}" class="card-img-top" alt="${product.productname}" onerror="this.onerror=null;this.src='../assets/images/ImageNotFound.png';"/>
              <div class="card-body">
                <h5 class="card-title">${truncatedName}</h5>
                  <button class="pt-2">More Info
                    <svg class="ps-2" width="30" height="15" viewBox="0 0 26 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.921997 6.98045H23.1524L16.6282 1.42285" stroke="white" stroke-width="1.58789"/>
                    </svg>
                  </button>
              </div>
            </div>
          </a>
        `;
  
        productElement.querySelector(".clickable-card").addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.setItem("selectedProduct", JSON.stringify(product));
            window.location.href = "../rfq/products-1-rfq.html";
          });
  
        productSection.appendChild(productElement);
      });
  
      if (products1.length > maxInitialItems && !showAllItems) {
        const seeMoreButton = document.createElement("button");
        seeMoreButton.textContent = "See More";
        seeMoreButton.classList.add("btn", "btn-primary", "see-more-button");
        seeMoreButton.addEventListener("click", () => {
          showAllItems = true;
          renderProducts(products1);
        });
        productSection.appendChild(seeMoreButton);
      }
    };
  
    const noProductFound = () => {
      productSection.innerHTML = `
      <div class="no-products-found" style="text-align: center; width: 100%; border: 1px solid #ccc; border-radius: 5px; padding: 20px 0 10px 0px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p style="font-size: 35px; color: #777;">Sorry, No products are currently listed under this Subcategory.</p>
      </div>
    `;
    };
}


function fetchProductsByCategory(categoryId) {
  fetch(`http://44.217.231.24:5002/api/category/${categoryId}`)
    .then((response) => response.json())
    .then((products) => {
      sessionStorage.setItem("fetchedProducts&Categories",JSON.stringify(products));
      const currentPage = window.location.pathname;
      let redirectPath;
      if (currentPage.includes("pages/")) {
        redirectPath = "../products-pages/Cigar-Product.html";
      } else {
        redirectPath = "./products-pages/Cigar-Product.html";
      }

      window.location.href = redirectPath;
    })
    .catch((error) => {
      // console.error("Error fetching products:", error);
    });
}


document.addEventListener("DOMContentLoaded", () => {
  const leafProducts = JSON.parse(sessionStorage.getItem("fetchedLeafData"));

  if (leafProducts && leafProducts.products && leafProducts.subCategories) {
    const products2 = leafProducts.products;
    const subCategories2 = leafProducts.subCategories;

    const navSection = document.querySelector(".nav-top");
    const leafImage = navSection.querySelector("img");
    const productSection1 = document.querySelector(".products-section1 .row1");

    leafImage.addEventListener("click", async () => {
      try {
        window.location.href = "../products-pages/Smoker-cloaker-aircare-purifiers.html";

        if (subCategories2.length > 0) {
          renderProducts2(subCategories2, ["col-lg-3", "col-md-4", "col-sm-6"], true);
        } else if (products2.length > 0) {
          renderProducts2(products2, ["col-lg-3", "col-md-4", "col-sm-6"], false);
        }
      } catch (error) {
        console.error("Error handling leaf image click:", error);
      }
    });

    const renderProducts2 = (items, cols, isSubcategory) => {
      const displayItems1 = showAllItems ? items : items.slice(0, maxInitialItems);
      productSection1.innerHTML = "";
      displayItems1.forEach((item) => {
        const productElement1 = document.createElement("div");
        productElement1.classList.add(...cols, "mb-4");

        const name = isSubcategory ? item.subCategoryname : item.productname;
        const description = item.description[0];
        const truncatedName = name.length > 50 ? name.substring(0, 50) + "..." : name;
        const truncatedDesc = description.length > 30 ? description.substring(0, 30) + "..." : description;
        const hrefLink = isSubcategory ? "../SubProduct/SubProduct.html" : "../products/products-1.html";

        productElement1.innerHTML = `
          <a href="${hrefLink}">
            <div class="card">
              <img src="${item.image[0]}" class="card-img-top" alt="${name}" onerror="this.onerror=null;this.src='../assets/images/ImageNotFound.png';"/>
              <div class="card-body">
                <h5 class="card-title">${truncatedName}</h5>
                ${
                  isSubcategory
                    ? `
                    <button class="pt-2">More Info
                      <svg class="ps-2" width="30" height="15" viewBox="0 0 26 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.921997 6.98045H23.1524L16.6282 1.42285" stroke="white" stroke-width="1.58789"/>
                      </svg>
                    </button>
                  `
                    : `
                  <p class="card-text">${truncatedDesc}</p>
                  `
                }
              </div>
            </div>
          </a>
        `;

        productElement1.querySelector("a").addEventListener("click", (e) => {
          e.preventDefault();
          sessionStorage.setItem(isSubcategory ? "selectedSubProduct" : "selectedProduct", JSON.stringify(item));
          window.location.href = hrefLink;
        });
        productSection1.appendChild(productElement1);
      });

      if (!showAllItems && items.length > maxInitialItems) {
        const seeMoreButton = document.createElement("button");
        seeMoreButton.textContent = "See More";
        seeMoreButton.classList.add("see-more-button");
        seeMoreButton.addEventListener("click", () => {
          showAllItems = true;
          renderProducts2(items, cols, isSubcategory);
        });
        productSection1.appendChild(seeMoreButton);
      }
    };
  } else {
    // console.error("No leaf products data found in sessionStorage.");
  }
});


function fetchBoth() {
  const productSection = document.querySelector(".products-section .row");
  const productSection1 = document.querySelector(".products-section1 .row1");
  const productHead = document.querySelector(".products-section");
  const products = JSON.parse(sessionStorage.getItem("fetchedProducts&Categories"));
  const selectedCategory = JSON.parse(sessionStorage.getItem("selectedCategory"));
  const fetchedLeafCategories = JSON.parse(sessionStorage.getItem("fetchedLeafCategories")) || {};
  const heroSection = document.querySelector(".hero-section .d-grid");
  const heroSection2 = document.querySelector(".hero-section");
  const heroSection3 = document.querySelector(".hero-section1");
  const navSection = document.querySelector('.nav-top .first-imgAir');
  const products1 = products?.products || [];
  const subCategories1 = products?.subCategories || [];
  const maxInitialItems = 8;
  let showAllItems = false;

  if (productHead && heroSection) {
    // productHead.querySelector("h2").textContent = "Take A Look At Our " + selectedCategory.name;
    heroSection.querySelector("h1").textContent = selectedCategory.name;
    heroSection.querySelector("p").textContent = selectedCategory.description;
  }

  if(selectedCategory !== null){
  if(selectedCategory.name === "⭐️ Toker Cloakers & Cannabis Products"){
    if (heroSection2 || heroSection3) {
      heroSection2.style.backgroundImage = "url('../assets/images/leaf-background.png')";
    }
  }
}

  // console.log("Product Section "+productSection);
  if (productSection || productHead) {
    productSection.innerHTML = "";

    const renderProducts = (items, cols, isSubcategory) => {
      const displayItems = showAllItems ? items : items.slice(0, maxInitialItems);
      productSection.innerHTML = "";
      displayItems.forEach((item) => {
        const productElement = document.createElement("div");
        productElement.classList.add(...cols, "mb-4");

        const name = isSubcategory ? item.subCategoryname : item.productname;
        const description = item.description[0];
        const truncatedName = name.length > 50 ? name.substring(0, 50) + "..." : name;
        const truncatedDesc = description.length > 30 ? description.substring(0, 30) + "..." : description;
        const hrefLink = isSubcategory ? "../SubProduct/SubProduct.html" : "../rfq/products-1-rfq.html";

        productElement.innerHTML = `
          <a href="${hrefLink}">
            <div class="card">
              <img src="${item.image[0]}" class="card-img-top" alt="${name}" onerror="this.onerror=null;this.src='../assets/images/ImageNotFound.png';"/>
              <div class="card-body">
                <h5 class="card-title">${truncatedName}</h5>
                ${
                  isSubcategory
                    ? `
                    <button class="pt-2">More Info
                      <svg class="ps-2" width="30" height="15" viewBox="0 0 26 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.921997 6.98045H23.1524L16.6282 1.42285" stroke="white" stroke-width="1.58789"/>
                      </svg>
                    </button>
                  `
                    : `
                  `
                }
              </div>
            </div>
          </a>
        `;

        productElement.querySelector("a").addEventListener("click", (e) => {
          e.preventDefault();
          sessionStorage.setItem(isSubcategory ? "selectedSubProduct" : "selectedProduct",JSON.stringify(item));
          window.location.href = hrefLink;
        });
        productSection.appendChild(productElement);
      });

      if (!showAllItems && items.length > maxInitialItems) {
        const seeMoreButton = document.createElement("button");
        seeMoreButton.textContent = "See More";
        seeMoreButton.classList.add("see-more-button");
        seeMoreButton.addEventListener("click", () => {
          showAllItems = true;
          renderProducts(items, cols, isSubcategory);
        });
        productSection.appendChild(seeMoreButton);
      }
    };

    if (subCategories1.length > 0) {
      renderProducts(subCategories1,["col-lg-3", "col-md-4", "col-sm-6"],true);
    } else if (products1.length > 0) {
      renderProducts(products1, ["col-lg-3", "col-md-4", "col-sm-6"], false);
    }

    if (selectedCategory.name === "⭐️ Smoker Cloaker Air Purifiers"){
      const leafImage = navSection.querySelector("img");
      navSection.querySelector("img").src = "../assets/images/leaf.png";
      navSection.querySelector("img").style.objectFit = "contain";
      fetchCategoryData("67167670efcb5e5d2c75cba7");
      navSection.querySelector("a").href = "../products-pages/Travel-desktop-humidors.html";
    }

    if (products1.length === 0 && subCategories1.length === 0) {
      window.location.href = "../pages/contact.html";
      return;
    }
  }
}
document.addEventListener("DOMContentLoaded", fetchBoth);


const fetchCategoryData = async (categoryId) => {
  fetch(`http://44.217.231.24:5002/api/category/${categoryId}`)
  .then((response) => response.json())
  .then((products) => {
    sessionStorage.setItem("fetchedLeafData",JSON.stringify(products));
  })
  .catch((error) => {
    // console.error("Error fetching products:", error);
  });
};


//Leaf-page
function fetchBoth1() {
  const productSection = document.querySelector(".products-section1 .row1");
  const productHead = document.querySelector(".products-section1");
  const products = JSON.parse(sessionStorage.getItem("fetchedLeafData"));
  const selectedCategory = JSON.parse(sessionStorage.getItem("selectedCategory"));
  const heroSection = document.querySelector(".hero-section1 .d-grid1");
  const products1 = products?.products || [];
  const subCategories1 = products?.subCategories || [];
  const maxInitialItems = 8;
  let showAllItems = false;
  const heroSection3 = document.querySelector(".hero-section1");

  if (productHead && heroSection) {
    // productHead.querySelector("h2").textContent = "Take A Look At Our " + products.name;
    heroSection.querySelector("h1").textContent = products.name;
    heroSection.querySelector("p").textContent = products.description;
    // console.log(selectedCategory.name+" "+selectedCategory.description);
  }

  // console.log("Hello "+selectedCategory.name);
  
  if(selectedCategory !== null){
  if(selectedCategory.name === "⭐️ Smoker Cloaker Air Purifiers"){
    if (heroSection3) {
      heroSection3.style.backgroundImage = "url('../assets/images/leaf-background.png')";
    }
  }
}

  if (productSection) {
    productSection.innerHTML = "";

    const renderProducts = (items, cols, isSubcategory) => {
      // console.log(items[0]._id);
      const displayItems = showAllItems ? items : items.slice(0, maxInitialItems);
      productSection.innerHTML = "";
      displayItems.forEach((item) => {
        const productElement = document.createElement("div");
        productElement.classList.add(...cols, "mb-4");

        const name = isSubcategory ? item.subCategoryname : item.productname;
        const description = item.description[0];
        const truncatedName = name.length > 50 ? name.substring(0, 50) + "..." : name;
        const truncatedDesc = description.length > 30 ? description.substring(0, 30) + "..." : description;
        const hrefLink = isSubcategory ? "../SubProduct/SubProduct.html" : "../rfq/products-1-rfq.html";

        productElement.innerHTML = `
          <a href="${hrefLink}">
            <div class="card">
              <img src="${item.image[0]}" class="card-img-top" alt="${name}" onerror="this.onerror=null;this.src='../assets/images/ImageNotFound.png';"/>
              <div class="card-body">
                <h5 class="card-title">${truncatedName}</h5>
                ${
                  isSubcategory
                    ? `
                    <button class="pt-2">More Info
                      <svg class="ps-2" width="30" height="15" viewBox="0 0 26 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.921997 6.98045H23.1524L16.6282 1.42285" stroke="white" stroke-width="1.58789"/>
                      </svg>
                    </button>
                  `
                    : `
                  <p class="card-text">${truncatedDesc}</p>
                  `
                }
              </div>
            </div>
          </a>
        `;

        productElement.querySelector("a").addEventListener("click", (e) => {
          e.preventDefault();
          sessionStorage.setItem(isSubcategory ? "selectedSubProduct" : "selectedProduct",JSON.stringify(item));
          window.location.href = hrefLink;
        });
        productSection.appendChild(productElement);
      });

      if (!showAllItems && items.length > maxInitialItems) {
        const seeMoreButton = document.createElement("button");
        seeMoreButton.textContent = "See More";
        seeMoreButton.classList.add("see-more-button");
        seeMoreButton.addEventListener("click", () => {
          showAllItems = true;
          renderProducts(items, cols, isSubcategory);
        });
        productSection.appendChild(seeMoreButton);
      }
    };

    if (subCategories1.length > 0) {
      renderProducts(subCategories1,["col-lg-3", "col-md-4", "col-sm-6"],true);
    } else if (products1.length > 0) {
      renderProducts(products1, ["col-lg-3", "col-md-4", "col-sm-6"], false);
    }

    // if (selectedCategory.name === "⭐️ Smoker Cloaker Air Purifiers"){
    //   const leafImage = navSection.querySelector("img");
    //   navSection.querySelector("img").src = "../assets/images/leaf.png";
    //   navSection.querySelector("img").style.objectFit = "contain";
    //   fetchCategoryData("6750003c390f93522c4fb70e");
    //   navSection.querySelector("a").href = "../products-pages/Travel-desktop-humidors.html";
    // }

    if (products1.length === 0 && subCategories1.length === 0) {
      window.location.href = "../pages/contact.html";
      return;
    }
  }
}
document.addEventListener("DOMContentLoaded", fetchBoth1);


//SubProduct-section
document.addEventListener("DOMContentLoaded", () => {
  const productSection = document.querySelector(".subproduct-section .row");
  const heroSection = document.querySelector(".hero-sections .d-grid");
  const selectedProduct = JSON.parse(sessionStorage.getItem("selectedSubProduct"));
  const maxInitialItems = 8;
  let showAllItems = false;

  if (!selectedProduct || !selectedProduct._id) {
    return;
  }
  // console.log("hello wedding");
  const subCategoryId = selectedProduct._id;
  // console.log(alert("hello"));

  const apiUrl = `http://44.217.231.24:5002/api/subcategory/${subCategoryId}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const products1 = data.products;

      if (selectedProduct.subCategoryname && heroSection) {
        heroSection.querySelector("h1").textContent = selectedProduct.subCategoryname;
        heroSection.querySelector("p").textContent = selectedProduct.description;
      }

      if (products1 && products1.length > 0) {
        renderProducts(products1);
      } else {
        noProductFound();
      }
    })
    .catch((error) => {
      // console.error("Error fetching products by subcategory:", error);
    });

  const renderProducts = (products1) => {
    if (!productSection) {
      return;
    }

    productSection.innerHTML = "";

    const itemToShow = showAllItems ? products1.length : maxInitialItems;
    products1.slice(0, itemToShow).forEach((product) => {
      const productElement = document.createElement("div");
      productElement.classList.add("col-lg-3", "col-md-4", "col-sm-6", "mb-4");

      const truncatedName =
        product.productname.length > 60
          ? product.productname.substring(0, 60) + "..."
          : product.productname;
      const truncatedDesc =
        product.description.length > 100
          ? product.description.substring(0, 100) + "..."
          : product.description;

      productElement.innerHTML = `
        <a href="../rfq/products-1-rfq.html">
          <div class="card clickable-card">
            <img src="${product.image[0]}" class="card-img-top" alt="${product.productname}" onerror="this.onerror=null;this.src='../assets/images/ImageNotFound.png';"/>
            <div class="card-body">
              <h5 class="card-title">${truncatedName}</h5>
                <button class="pt-2">More Info
                  <svg class="ps-2" width="30" height="15" viewBox="0 0 26 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.921997 6.98045H23.1524L16.6282 1.42285" stroke="white" stroke-width="1.58789"/>
                  </svg>
                </button>
            </div>
          </div>
        </a>
      `;

      productElement
        .querySelector(".clickable-card")
        .addEventListener("click", (e) => {
          e.preventDefault();
          sessionStorage.setItem("selectedProduct", JSON.stringify(product));
          window.location.href = "../rfq/products-1-rfq.html";
        });

      productSection.appendChild(productElement);
    });

    if (products1.length > maxInitialItems && !showAllItems) {
      const seeMoreButton = document.createElement("button");
      seeMoreButton.textContent = "See More";
      seeMoreButton.classList.add("btn", "btn-primary", "see-more-button");
      seeMoreButton.addEventListener("click", () => {
        showAllItems = true;
        renderProducts(products1);
      });
      productSection.appendChild(seeMoreButton);
    }
    // document.querySelectorAll(".toggle-description").forEach((toggle) => {
    //   toggle.addEventListener("click", (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     const cardText = e.target.closest(".card-text");
    //     const descriptionText = cardText.querySelector(".description-text");
    //     const fullDescription = cardText.querySelector(".full-description");

    //     if (descriptionText.style.display === "none") {
    //       descriptionText.style.display = "inline";
    //       fullDescription.style.display = "none";
    //       e.target.textContent = "See More";
    //     } else {
    //       descriptionText.style.display = "none";
    //       fullDescription.style.display = "inline";
    //       e.target.textContent = "See Less";
    //     }
    //   });
    // });
  };

  const noProductFound = () => {
    productSection.innerHTML = `
    <div class="no-products-found" style="text-align: center; width: 100%; border: 1px solid #ccc; border-radius: 5px; padding: 20px 0 10px 0px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p style="font-size: 35px; color: #777;">Sorry, No products are currently listed under this Subcategory.</p>
    </div>
  `;
  };
});

const style = document.createElement("style");
style.innerHTML = `
  .card-body{
    // padding: 20px 0;
  }
  .card-title, .card-text {
    text-decoration: underline #fff;
    font-weight: bold;
  }
  .card-text{
    color: #667479;
  }
`;
document.head.appendChild(style);


//Product-Desc
document.addEventListener("DOMContentLoaded", () => {
  const product = JSON.parse(sessionStorage.getItem("selectedProduct"));
  // console.log("HEllo"+product.image[0]);
  if (product) {
    const truncatedDescription =
      product.description.length > 150
        ? product.description.substring(0, 1000) + "..."
        : product.description;

    const productImgH2 = document.querySelector(".product-img h2");
    const productImgImg = document.querySelector(".product-img img");
    const productInfoH1 = document.querySelector(".product-info h1");
    const productInfoPrice = document.querySelector(".product-info h5.price");
    const productInfoP = document.querySelector(".product-info p");
    const rfqLink = document.querySelector(".product-info a");
    if (productImgH2) productImgH2.textContent = product.subCategoryname;
    if (productImgImg) {
      productImgImg.src = product.image[0];
      productImgImg.alt = product.productname;

      productImgImg.onerror = function () {
        this.onerror = null;
        this.src = "../assets/images/ImageNotFound.png";
      };
    }
    if (productInfoH1) productInfoH1.textContent = product.description;
    if (productInfoPrice)
      productInfoPrice.textContent = product.subCategoryname;
    // if (productInfoP) productInfoP.textContent = product.description;
    if (productInfoP && Array.isArray(product.description)) {
      productInfoP.innerHTML = "";
      const ul = document.createElement("ul");

      product.description.forEach((data) => {
        const li = document.createElement("li");
        li.textContent = data;
        ul.appendChild(li);
      });
      productInfoP.appendChild(ul);
    } else if (productInfoP) {
      productInfoP.textContent = product.description;
    }

    if (rfqLink) {
      rfqLink.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.setItem(
          "selectedProductForRFQ",
          JSON.stringify(product)
        );
        window.location.href = rfqLink.href;
      });
    }
  } else {
    // console.error("No product data found in sessionStorage");
  }
});


//Product-RFQ
document.addEventListener("DOMContentLoaded", () => {
  const product = JSON.parse(sessionStorage.getItem("selectedProduct"));

  if(product.categoryId === "673defc54f7ddf0af9169232"){
    document.querySelector(".contain").style.backgroundImage = "url(../assets/images/Cigars_img.png)";
    document.querySelector(".contain").style.backgroundSize = "cover";
    document.querySelector(".contain").style.backgroundPosition = "center";
  }else if(product.categoryId === "673b4dc1fe9f7bb11efc3360"){
    document.querySelector(".contain").style.backgroundImage = "url(../assets/images/Air-Purifiers_img.png)";
    document.querySelector(".contain").style.backgroundSize = "cover";
    document.querySelector(".contain").style.backgroundPosition = "center";
  }else if(product.categoryId === "671683d72d2639068f26b6dd"){
    document.querySelector(".contain").style.backgroundImage = "url(../assets/images/Wedding_img.png)";
    document.querySelector(".contain").style.backgroundSize = "cover";
    document.querySelector(".contain").style.backgroundPosition = "center";
    console.log("Its wedding");
  }else if(product.categoryId === "671683942d2639068f26b6a0"){
    document.querySelector(".contain").style.backgroundImage = "url(../assets/images/Golf_img.png)";
    document.querySelector(".contain").style.backgroundSize = "cover";
    document.querySelector(".contain").style.backgroundPosition = "center";
  }

  if (product) {
    const fullDescription = product.description;
    const truncatedDescription =
      product.description.length > 150
        ? product.description.substring(0, 150) + "..."
        : product.description;

    const productInfo1 = document.querySelector(".product-info h1");
    const productPrice = document.querySelector(".product-info .price");
    const productDesc = document.querySelector(".product-info .description");
    const productId = document.querySelector(".product-info .id");
    const productDetailImg = document.querySelector(".product-details img");
    const thumbnailContainer = document.querySelector(".thumbnail-container");

    if (productInfo1) productInfo1.textContent = product.productname;
    if (productPrice) productPrice.textContent = product.category;
    if (productId) productId.textContent = "SKU Number: " + product.itemId;

    if (productDesc) {
      if (Array.isArray(product.description)) {
        productDesc.innerHTML = "";
        const ul = document.createElement("ul");

        product.description.forEach((data) => {
          const li = document.createElement("li");
          li.textContent = data;
          ul.appendChild(li);
        });
        productDesc.appendChild(ul);
      } else {
        productDesc.innerHTML = `
          <span class="truncated-description">${truncatedDescription}</span>
          <span class="full-description" style="display: none;">${fullDescription}</span>
          ${
            fullDescription.length > 150
              ? `<a href="#" class="toggle-description">See More</a>`
              : ""
          }`;
        const toggleLink = productDesc.querySelector(".toggle-description");
        const truncatedSpan = productDesc.querySelector(".truncated-description");
        const fullSpan = productDesc.querySelector(".full-description");

        toggleLink.addEventListener("click", (e) => {
          e.preventDefault();
          if (fullSpan.style.display === "none") {
            fullSpan.style.display = "inline";
            truncatedSpan.style.display = "none";
            toggleLink.textContent = "See Less";
          } else {
            fullSpan.style.display = "none";
            truncatedSpan.style.display = "inline";
            toggleLink.textContent = "See More";
          }
        });
      }
    }

    if (productDetailImg) {
      productDetailImg.src = product.image[0];
      productDetailImg.onerror = function () {
        this.onerror = null;
        this.src = "../assets/images/ImageNotFound.png";
      };
    }

    if (thumbnailContainer && product.image.length > 1) {
      product.image.slice(0, 5).forEach((imgSrc, index) => {
        const thumbnail = document.createElement("img");
        thumbnail.src = imgSrc;
        thumbnail.classList.add("thumbnail");
        thumbnail.style.width = "80px";
        thumbnail.style.height = "80px";
        thumbnail.addEventListener("click", () => {
          productDetailImg.src = imgSrc;
        });
        thumbnailContainer.appendChild(thumbnail);
      });
    }

    const rfqLink = document.querySelector(".product-info a");
    if (rfqLink) {
      rfqLink.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.setItem("selectedProductForRFQ", JSON.stringify(product)
        );
        window.location.href = rfqLink.href;
      });
    }
  } else {
    // console.error("No product data found in sessionStorage");
  }
});


//About-Us
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://44.217.231.24:5002/api/aboutUs/")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      document.getElementById("startContent").innerHTML =
        data[0]?.startContent || "<p>No startContent found</p>";

      const missionImageElement = document.getElementById("missionImage");
      if (Array.isArray(data[0]?.image) && data[0].image.length > 0) {
        missionImageElement.src = data[0].image[0];
      } else {
        missionImageElement.src = "https://via.placeholder.com/150";
      }

      document.getElementById("missionContent").innerHTML =
        data[0]?.missionContent || "<p>No missionContent found</p>";
    })
    .catch((error) => {
      // console.error("Error fetching data:", error);
    });
});


// Footer
document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://44.217.231.24:5002/api/footer/get";

  fetch(apiUrl).then(response => response.json()).then(data => {
    if(data.status === 200 && data.data.length > 0){

      const activeData = data.data.filter(item => item.active);
      // console.log(activeData);
      if(activeData.length> 0){
        const footerData = activeData[0];

        document.getElementById("facebook-link").href = footerData.facebook;
        document.getElementById("instagram-link").href = footerData.instagram;
        document.getElementById("twitter-link").href = footerData.twitter;
        document.getElementById("tiktok-link").href = footerData.tiktok;
        document.querySelector(".s-text").textContent = footerData.copyright;
      }
    }else{
      // console.log("No Data coming from Footer API");
    }
  }).catch(error => 
    console.log("There is problem in the API")
  );
})