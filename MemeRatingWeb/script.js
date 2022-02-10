// Meme 1's elements (Left Side)
const meme1_card = document.querySelector("#meme1_card");
const meme1_image = document.querySelector("#meme1-image");
const meme1_rating = document.querySelector("#meme1-rating");
const meme1_card_content = document.querySelector("#meme1-card-content");
// Meme 2's elements (Right Side)
const meme2_card = document.querySelector("#meme2_card");
const meme2_image = document.querySelector("#meme2-image");
const meme2_rating = document.querySelector("#meme2-rating");
const meme2_card_content = document.querySelector("#meme2-card-content");
// Next Memes
const action_title = document.querySelector("#action-title");
const next_meme_button = document.querySelector("#next-meme-button");
// Submit + Input Elements
const meme_url = document.querySelector("#meme-url");
const submit_button = document.querySelector("#submit-button");

const db = firebase.database();

submit_button.addEventListener("click", (e) => {
    if (meme_url.value == "") {
        alert("Whoops, I believe you forgot to include the URL of the meme...");
    } else {
        db.ref("/memes").push({
            url : meme_url.value,
            rating: 0
        });
        meme_url.value = "";
        console.log("uploaded meme!");
    }
});

const incrementMeme = (memeID, card_clicked) => {
    // increment the specific meme's rating (database)
    db.ref('/memes/').child(memeID + "/rating").set(firebase.database.ServerValue.increment(1));

    // increment on page
    if (card_clicked == 1) {
        db.ref('memes').once('value', (snapshot) => {
            let memes_data = snapshot.val();
            let meme = memes_data[memeID];
            let num = meme.rating;
            meme1_rating.innerText = "Rating: " + num;
            meme1_card_content.setAttribute("style", "background-color: rgb(162, 220, 162);");
        });
    } else if (card_clicked == 2) {
        db.ref('memes').once('value', (snapshot) => {
            let memes_data = snapshot.val();
            let meme = memes_data[memeID];
            let num = meme.rating;
            meme2_rating.innerText = "Rating: " + num;
            meme2_card_content.setAttribute("style", "background-color: rgb(162, 220, 162);");
        });
    } else {
        console.log("Error... invalid card??");
    }

    // disable the "onclick" attribute in both memes
    // so neither can be infinitely clicked again
    meme1_card.removeAttribute("onclick");
    meme2_card.removeAttribute("onclick");

    action_title.innerText = "Click below to refresh the memes!";

}

// refresh memes & add new ID's to "onclick" attribute
const changeMemes = () => {
    db.ref('memes').once('value', (snapshot) => {
        let memes_data = snapshot.val();
        let memes_keys = Object.keys(memes_data);
        let length = memes_keys.length;
        

        let random_key1 = memes_keys[Math.floor(Math.random()*length)];
        let chosen_meme1 = memes_data[random_key1];
        let url = chosen_meme1.url
        let rating = chosen_meme1.rating;
        meme1_image.src = url;
        meme1_rating.innerText = "Rating: " + rating;
        meme1_card.setAttribute("onclick", `incrementMeme("${random_key1}", 1)`);

        let random_key2 = memes_keys[Math.floor(Math.random()*length)];
        if (memes_keys.length > 1)
            while (random_key2 == random_key1)
                random_key2 = memes_keys[Math.floor(Math.random()*length)];
        let chosen_meme2 = memes_data[random_key2];
        url = chosen_meme2.url
        rating = chosen_meme2.rating;
        meme2_image.src = url;
        meme2_rating.innerText = "Rating: " + rating;
        meme2_card.setAttribute("onclick", `incrementMeme("${random_key2}", 2)`);
        
        action_title.innerText = "Choose the best meme...";
        meme1_card_content.removeAttribute("style");
        meme2_card_content.removeAttribute("style");
        console.log("refreshed memes!");
    });
}

next_meme_button.addEventListener("click", (e) => {
    changeMemes();
})


// run when loading webpage:
changeMemes();