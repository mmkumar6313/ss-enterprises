let allCustomers = [];
let selectedCustomer = null;

function showTab(tab){

    // Hide all tabs
    document.getElementById(
        "customersTab"
    ).style.display = "none";

    document.getElementById(
        "wishesTab"
    ).style.display = "none";

    document.getElementById(
        "offersTab"
    ).style.display = "none";


    // Show selected tab
    document.getElementById(
        tab + "Tab"
    ).style.display = "block";


    // Remove active class
    document.querySelectorAll(
        ".nav-link"
    ).forEach(btn => {

        btn.classList.remove(
            "active"
        );

    });


    // Add active class
    event.target.classList.add(
        "active"
    );
}


const scriptURL =
"https://script.google.com/macros/s/AKfycbx5EvXzsmC_gOdqdPHsC_Df57hAv2FYltvIhW10aLeA3sSBbQ_a9MtuwAWNBDPN7Jg1Ng/exec";

document
.getElementById("customerForm")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const customer = {
        name:
        document.getElementById("name").value,

        phone:
        document.getElementById("phone").value,

        village:
        document.getElementById("village").value,

        machine:
        document.getElementById("machine").value
    };

    const saveBtn =
document.getElementById(
  "saveCustomerBtn"
);

saveBtn.disabled = true;
saveBtn.innerText =
"Saving...";

    try{

        const response =
        await fetch(scriptURL,{
            method:"POST",
            body:
            JSON.stringify(customer)
        });

        const result =
        await response.json();

        if(result.status === "success"){

           alert(
  "Customer Saved Successfully"
);

this.reset();

loadCustomers();

saveBtn.disabled =
false;

saveBtn.innerText =
"Save Customer";
        }

    }catch(error){

    console.log(error);

    alert(
      "Something went wrong"
    );

    saveBtn.disabled =
    false;

    saveBtn.innerText =
    "Save Customer";
}

});

async function loadCustomers(){

    const response =
    await fetch(scriptURL);

    const customers =
    await response.json();
    allCustomers = customers;

    let html = "";

    customers.forEach(customer => {

        html += `
        <div class="card p-3 mb-3 shadow-sm">

            <h5>${customer.name}</h5>

            <p>
            ${customer.phone}
            </p>

            <p>
            ${customer.village}
            </p>

            <button
            class="btn btn-success"
            onclick="sendWish('${customer.phone}')">

            Sankranti Wishes

            </button>

        </div>
        `;
    });

    
}

function sendWish(phone){

    const message =
    "Happy Sankranti 🌾 Thank you for supporting our business.";

    window.open(
      `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`
    );
}

loadCustomers();

function toggleWishAudience(){

    const selected =
    document.querySelector(
      'input[name="wishAudience"]:checked'
    ).value;

    document.getElementById(
      "singleWishUser"
    ).style.display =
    selected === "single"
    ? "block"
    : "none";
}


function previewWishImage(){

    const imageInput =
    document.getElementById(
      "wishImage"
    );

    if(
      imageInput.files.length > 0
    ){

        const file =
        imageInput.files[0];

        const reader =
        new FileReader();

        reader.onload =
        function(e){

            document
            .getElementById(
              "wishPreview"
            )
            .style.display =
            "block";

            document
            .getElementById(
              "wishPreviewImage"
            )
            .src =
            e.target.result;
        };

        reader.readAsDataURL(
          file
        );
    }
}


function sendWishNow(){

    // Poster validation
    const imageInput =
    document.getElementById(
      "wishImage"
    );

    if(imageInput.files.length === 0){

        alert(
          "Please upload festival poster"
        );

        return;
    }

    const selected =
    document.querySelector(
      'input[name="wishAudience"]:checked'
    ).value;

    // All customers
    if(selected === "all"){

        const modal =
        new bootstrap.Modal(
          document.getElementById(
            "whatsappModal"
          )
        );

        modal.show();

        resetWishForm();

        return;
    }

    // Individual
    if(!selectedCustomer){

        alert(
          "Please select customer"
        );

        return;
    }

    const phone =
    String(selectedCustomer.phone)
    .replace(/\D/g,'');

    window.open(
      `https://wa.me/91${phone}`,
      "_blank"
    );

    resetWishForm();
}

function toggleWishAudience(){

    const selected =
    document.querySelector(
      'input[name="wishAudience"]:checked'
    ).value;

    const customerBox =
    document.getElementById(
      "individualCustomerBox"
    );

    const broadcastInfo =
    document.getElementById(
      "broadcastInfo"
    );

    if(selected === "single"){

        customerBox.style.display =
        "block";

        broadcastInfo.style.display =
        "none";

    }else{

        customerBox.style.display =
        "none";

        broadcastInfo.style.display =
        "block";
    }
}


function searchCustomer(){

    const keyword =
    document
    .getElementById("customerSearch")
    .value
    .trim()
    .toLowerCase();

    const resultsBox =
    document.getElementById(
      "searchResults"
    );

    // Empty అయితే dropdown hide
    if(keyword === ""){

        resultsBox.innerHTML = "";
        return;
    }

    const filtered =
    allCustomers.filter(customer => {

        const name =
        String(customer.name || "")
        .toLowerCase();

        const phone =
        String(customer.phone || "");

        const village =
        String(customer.village || "")
        .toLowerCase();

        return (
            name.includes(keyword)
            ||
            phone.includes(keyword)
            ||
            village.includes(keyword)
        );
    });

    let html = "";

    if(filtered.length === 0){

        html = `
        <div class="list-group-item">
            No customer found
        </div>
        `;
    }

    filtered.forEach(customer => {

        html += `
        <button
            type="button"
            class="list-group-item list-group-item-action"
            onclick="selectCustomer(
              '${customer.name}',
              '${customer.phone}',
              '${customer.village}'
            )">

            ${customer.name}
            -
            ${customer.village}
            -
            ${customer.phone}

        </button>
        `;
    });

    resultsBox.innerHTML = html;
}


function selectCustomer(
    name,
    phone,
    village
){

    selectedCustomer = {
        name,
        phone,
        village
    };

    document.getElementById(
      "customerSearch"
    ).value =
    `${name} - ${village}`;

    document.getElementById(
      "searchResults"
    ).innerHTML = "";

    // show selected card
    document.getElementById(
      "selectedCustomerCard"
    ).style.display =
    "block";

  document.getElementById(
  "selectedCustomerInfo"
).innerHTML = `
    <div class="customer-info-name">
        ${name}
    </div>

    <div class="customer-info-text">
        📍 ${village}
    </div>

    <div class="customer-info-text">
        📞 ${phone}
    </div>
`;
}

let selectedOfferCustomer = null;


function previewOfferImage(){

    const imageInput =
    document.getElementById(
      "offerImage"
    );

    if(imageInput.files.length > 0){

        const file =
        imageInput.files[0];

        const reader =
        new FileReader();

        reader.onload =
        function(e){

            document
            .getElementById(
              "offerPreview"
            )
            .style.display =
            "block";

            document
            .getElementById(
              "offerPreviewImage"
            )
            .src =
            e.target.result;
        };

        reader.readAsDataURL(file);
    }
}


function toggleOfferAudience(){

    const selected =
    document.querySelector(
      'input[name="offerAudience"]:checked'
    ).value;

    const customerBox =
    document.getElementById(
      "offerCustomerBox"
    );

    const broadcastInfo =
    document.getElementById(
      "offerBroadcastInfo"
    );

    if(selected === "single"){

        customerBox.style.display =
        "block";

        broadcastInfo.style.display =
        "none";

    }else{

        customerBox.style.display =
        "none";

        broadcastInfo.style.display =
        "block";
    }
}


function searchOfferCustomer(){

    const keyword =
    document
    .getElementById(
      "offerCustomerSearch"
    )
    .value
    .trim()
    .toLowerCase();

    const resultsBox =
    document.getElementById(
      "offerSearchResults"
    );

    if(keyword === ""){

        resultsBox.innerHTML = "";
        return;
    }

    const filtered =
    allCustomers.filter(customer => {

        const name =
        String(customer.name || "")
        .toLowerCase();

        const phone =
        String(customer.phone || "");

        const village =
        String(customer.village || "")
        .toLowerCase();

        return (
            name.includes(keyword)
            ||
            phone.includes(keyword)
            ||
            village.includes(keyword)
        );
    });

    let html = "";

    filtered.forEach(customer => {

        html += `
        <button
            type="button"
            class="list-group-item list-group-item-action"
            onclick="selectOfferCustomer(
              '${customer.name}',
              '${customer.phone}',
              '${customer.village}'
            )">

            ${customer.name}
            -
            ${customer.village}
            -
            ${customer.phone}

        </button>
        `;
    });

    resultsBox.innerHTML = html;
}


function selectOfferCustomer(
    name,
    phone,
    village
){

    selectedOfferCustomer = {
        name,
        phone,
        village
    };

    document.getElementById(
      "offerCustomerSearch"
    ).value =
    `${name} - ${village}`;

    document.getElementById(
      "offerSearchResults"
    ).innerHTML = "";

    document.getElementById(
      "selectedOfferCustomerCard"
    ).style.display =
    "block";

    document.getElementById(
  "selectedOfferCustomerInfo"
).innerHTML = `
    <div class="customer-info-name">
        ${name}
    </div>

    <div class="customer-info-text">
        📍 ${village}
    </div>

    <div class="customer-info-text">
        📞 ${phone}
    </div>
`;
}


function sendOfferNow(){

    const imageInput =
    document.getElementById(
      "offerImage"
    );

    if(imageInput.files.length === 0){

        alert(
          "Please upload offer poster"
        );

        return;
    }

    const selected =
    document.querySelector(
      'input[name="offerAudience"]:checked'
    ).value;

    if(selected === "all"){

        const modal =
        new bootstrap.Modal(
          document.getElementById(
            "whatsappModal"
          )
        );

        modal.show();

        resetOfferForm();

        return;
    }

    if(!selectedOfferCustomer){

        alert(
          "Please select customer"
        );

        return;
    }

    const phone =
    String(
      selectedOfferCustomer.phone
    )
    .replace(/\D/g,'');

    window.open(
      `https://wa.me/91${phone}`,
      "_blank"
    );

    resetOfferForm();
}

function openWhatsAppBusiness(){

    window.open(
      "https://wa.me",
      "_blank"
    );
}

function resetWishForm(){

    // image reset
    document.getElementById(
      "wishImage"
    ).value = "";

    // preview hide
    document.getElementById(
      "wishPreview"
    ).style.display =
    "none";

    document.getElementById(
      "wishPreviewImage"
    ).src = "";

    // search clear
    document.getElementById(
      "customerSearch"
    ).value = "";

    document.getElementById(
      "searchResults"
    ).innerHTML = "";

    // selected customer clear
    selectedCustomer = null;

    // reset radio
    document.querySelector(
      'input[name="wishAudience"][value="all"]'
    ).checked = true;

    toggleWishAudience();

    document.getElementById(
  "selectedCustomerCard"
).style.display = "none";

document.getElementById(
  "selectedCustomerInfo"
).innerHTML = "";
}

function resetOfferForm(){

    document.getElementById(
      "offerImage"
    ).value = "";

    document.getElementById(
      "offerPreview"
    ).style.display =
    "none";

    document.getElementById(
      "offerPreviewImage"
    ).src = "";

    document.getElementById(
      "offerCustomerSearch"
    ).value = "";

    document.getElementById(
      "offerSearchResults"
    ).innerHTML = "";

    selectedOfferCustomer =
    null;

    document.querySelector(
      'input[name="offerAudience"][value="all"]'
    ).checked = true;

    toggleOfferAudience();

    document.getElementById(
  "selectedOfferCustomerCard"
).style.display = "none";

document.getElementById(
  "selectedOfferCustomerInfo"
).innerHTML = "";
}