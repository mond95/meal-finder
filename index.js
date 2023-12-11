// first thing is to bring in our DOM elements
// getting it for the search input and the search button
// to prevent from having to write 'const' twice, can put a comma as a shortcut to 'const' everything else automatically
const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal");

// FUNCTIONS

// ~ Search meal and fetch from API
// Want to fetch the meals, hit the endpoint and loop through and output them to the DOM */
function searchMeal(e) {
  /* Since this is a 'submit', we need to prevent the default behaviour so we're going to pass in our event parameter (e) and 
just call e.preventDefault() (because we odn't want to actually try submit to a file) */
  e.preventDefault();
  /* if we search and have a grid of the meals and have that single meal underneath as per the demo, if 
  he searches again he wants that single meal to go away so will do that here */

  // Clear single meal
  // = getting the single meal element and setting the innerHTML to nothing
  single_mealEl.innerHTML = "";

  // Get the search term
  //   we want the value of the search not the actual input element - adding .value will give us whatever we type in
  const term = search.value;
  // can test it is taking the value by doing: console.log(term);

  // Check for empty
  // to make sure something was actually submitted
  // adding trim to trim white space
  if (term.trim()) {
    // if we do put something in, we want to make a fetch request
    // it's a get request so we don't need to specify the method
    // using https://www.themealdb.com/api.php -- using the endpoint for searching meal by name 'www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata'
    // I HAD TO ADD 'https://' before this like he did for it to work!
    // the search term will be dynamic so we will fill the end bit from 's=' with the search value (which we have assigned to
    // a variable called 'term' instead of 'Arrabiata'
    /* how the fetch API works is it returns a promise and we catch a promise with '.then()'
    and then that gives us a response 'res' which we have to format to json so have to say 'res.json()'
    which returns another promise so have to do a second '.then()' and that will actually give us the data */
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) =>
        //   opening up a block here just to console log the data to show you what it looks like
        {
          console.log(data);
          // First filling in the resultHeading div
          //   inserting this H2 text into that resultHeading div
          resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;
          // Now we want to fill in the meals in the meals div
          // want to check to see if there are any meals with the search term
          //   'meals' is the name of the array which has all the recipe results in
          if (data.meals === null) {
            resultHeading.innerHTML = `<p>There are no search resuls. Try again!</p>`;
          } else {
            // we want to take our meals element and want to set the inner html and we want to map through the meals we get back which is going to be in data.meals
            // and we're going to use the .map() method and say for each meal we want to output a div with the class of meal
            /* we have acccess now to everything in each meal i.e. each property and one of those is strMealThumb (meal thumbnail)
            so can put this in an image tag 
            You can see all these properties in the console log of the data 
            For the alt in the image tag will put the title of the meal i.e. strMeal 
            Then going to have a div underneath with the class of meal info because we want to have the title if we hover over it 
            This will also have the meal id -  when you add custom HTML 5 attributes, you want it to be a data attribute so we're going to do
            'data-' in front of whatever we want to call that attribute which will be mealID and we will set that to idMeal
            This means each meal will have a data meal ID attribute with the value in from the API's mealID 
            Inside that div, will have a H3 we will have the meal title (strMeal) 
            We need this to display as a string because what we've done with .map() is loop through the array, but we want this to display as a string
            so at the endof the else statement just need to add .join and then an empty set of quotes*/
            /* The join() method of Array instances creates and returns a new string by concatenating all of the elements in this array, separated by commas or a specified separator string. */
            // (NOTE: because of the .map() every meal returned will now put it in the DOM i.e. create and populate html with this format in yellow)
            // annoyingly couldn't get it to work for agess and it kept messing up the divs and not showing the meal name and it was because i missed off the closing " from the alt tags so it made the html tags not work
            mealsEl.innerHTML = data.meals
              .map(
                (meal) => `
                <div class="meal">
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                  <div class="meal-info" data-mealID="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                  </div>
                </div>`
              )
              .join("");
          }
        }
      );
    // CLEAR SEARCH TEXT - take search and set value to nothing
    search.value = "";
  } else {
    alert("Please enter a search term");
  }
}

// Fetch meal by ID
// this function will take in a mealId
function getMealByID(mealID) {
  // make a fetch request again - the endpoint we want in the documentation is the one which mentions "Lookup full meal details by id": www.themealdb.com/api/json/v1/1/lookup.php?i=52772
  // of course we want the meal ID in the endpoint to be dynamic so replace this '52772' so replace that with the mealID
  // LIKE THE ABOVE, IT WASN'T WORKING AND HAD THE ERRORS:
  /* Access to fetch at 'file:///Users/monicadiep/Documents/recipe-website/meal%20finder/www.themealdb.com/api/json/v1/1/lookup.php?i=52795' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: 
  http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted.
www.themealdb.com/api/json/v1/1/lookup.php?i=5 
Failed to load resource: net::ERR_FAILED
       Uncaught (in promise) TypeError: Failed to fetch
    at getMealByID (index.js:106:3)
    at HTMLDivElement.<anonymous> (index.js:179:5)
*/
  // SO LIKE ABOVE I HAD TO ADD 'https://' WHICH HE ALSO DOES ON HIS SCREEN IT JUST DOESN'T HAVE THAT IN THE MEAL DB API DOCUMENTATION AND IT WORKS
  // fetch will give us a promise that returns a response and we want that response to be in JSON
  // then that will give us a promise and we get our data
  // then will create a variable called meal
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      // can console log to see what this data gives us first
      // console.log(data);
      /* e.g. we search for steak and click on one of the results and in the console we get 'meals' which is an array - even though it's just a single meal, it's still inside of an array!! */
      // now let's set a variable called meal and set it to 'data.meals' and remember it's an array so we want the first value [0]
      const meal = data.meals[0];
      // going to have another function to actually add this data to the DOM and we'll pass in that meal
      addMealToDom(meal);
    });
}

// Fetch RANDOM meal from API
// if we already searched and there are columns of meal results then we want to clear those
// we also want to clear up any headings from past search results
function getRandomMeal() {
  // Clear meals and headings (by setting innerHTMl of these sections to nothing)
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  // Make a request for a random meal
  // in the API dcumentation they provide the endpoint for a random meal
  // www.themealdb.com/api/json/v1/1/random.php but again don't forget to add 'https://' to it or it doesn't work!!

  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    // get the promise back
    .then((res) => res.json())
    // again it will give us back an array even though it's one meal
    // so we'll create a variable and set it to data.meals and we want the first and only one i.e [0]
    .then((data) => {
      const meal = data.meals[0];
      // then call the addMealToDom function just like we do when we search for a mela
      addMealToDom(meal);
    });
}

// Add meal to DOM
function addMealToDom(meal) {
  // this is the part where the bit with the ingredients is tricky
  // in the API response, if you look how it's formatted for the ingredients we have strIngredient1, strIngredient2 etc etc
  // then further down we have string measurement 1 (strMeasurement1) "2tbs" etc
  // so we have to match the strIngredient number to the strMeasurement number
  // it would have been much better if they just returned an array of the measure and the ingredient
  // so that's basically what we want to create = an array with the measurement and the ingredient from this chaos
  // creating an array called ingredients:
  // initialising an array
  const ingredients = [];
  // then we'll do a FOR LOOP - let i = 1 and s long as i is less than or equal to 20 (max of 20 ingredients), then we want to increment by 1
  for (let i = 1; i <= 20; i++) {
    // then do an if-else statement to check if there's an ingredient
    // insetad of using the dot syntax i.e. meal.strIngredient, we can't do that because we're using a variable in here so we need to use the bracket syntax!!
    // use back ticks and then the number of which is going to be whatever that 'i' value is in this current iteration
    // going to check to see if there's an ingredient (e.g. as may not have up to 20 ingredients) and if there is we're going to take our ingredients array and will push onto it
    // we want to have the ingredient and the measurement in here e.g. the 'ingredient - measurement'
    // the i number will be whatever the current iteration is allowing e.g. strIngredient1 to go with strMeasure1 etc so they match up and we will have an array of that
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    }
    // else if the string ingredient isn't found we're going to break out of the for loop (as mentioned the recipe won't always use max 20 ingredients) so comes through with an empty string e.g. stringredient20: ""
    else {
      break;
    }
  }
  // now we want to output our HTML for this single meal
  // outside of the for loop but still within the addMealToDom function:
  // can check and see when we click on one of the steak meals, it will output the h1 of the meal's name on the page below it
  // adding a div for the category and the area
  // we're checking for the category using a ternary operator '?' which checks if there's a category, then we will output a paragraph with the category, else using ":" we will just output an empty string
  // we will do the same thing for the 'strArea' property - want to check for that first as some don't have it so might run into issues
  // adding another div with the class of main where we will have a paragraph with the recipe instructions
  // then adding an H2 underneath with the ingredients heading and the ingredients underneath in an unordered list
  // we have the ingredients array we created above and we're going to map through them using '.map()' and say for each ingredient we want to output a list item with the ingredient
  // and if we want to add this as a string we have to add '.join' to the end (otherwise the bullet points end up having a ',' - join() will convert an array to a string. If we didn't give it an argument, it separates them via commas.
  // But you can call the join method with an empty string as a parameter ( join("") ). The method will return a string with all the array elements concatenated without a comma. )
  single_mealEl.innerHTML = `
  <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="single-meal-info">
      ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
      ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
    </div>
    <div class="main">
      <p>${meal.strInstructions}</p>
      <h2>Ingredients</h2>
      <ul>
        ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}

      </ul>
    </div>
  </div>
  `;
}

// EVENT LISTENERS
// need an event listener for when we search - this will call the searchMeal function above
submit.addEventListener("submit", searchMeal);

// Also need an event listener for the 'random meal' button!
// this will be on 'click' instead as it's not a submit button
random.addEventListener("click", getRandomMeal);

/* Now need to be able to cick on the individual meal and get the recipe instructions show for it below. 
This will be tricky because we need to add an event listener to each one and we need to get the meal-ID.
If click on any one of the individual meals and open up the dev tools, can see that in the same 'meal-info' div there is an
attribute which has the 'data-mealID' and WE NEED TO BRING THAT IN SO WE CAN MAKE A REQUEST TO GET THAT SPECIFIC MEAL!!!
Starting on that, will take the mealsEl (meals element) which is the basically the container of each meal and we'll add an event listener
onto that when it's clicked and will add an arrow function to find if the meal-info div belongs to the element that we click
Will create a variable called mealInfo and going to set that to our event parameter 'e' and then we can use '.path.find' which will
go through all the child elements or items
*/
// mealsEl.addEventListener("click", (e) => {
//   const mealInfo = e.path.find((item) => {
//     // checking if there is a class
//     // if(item.classList) will return flase if there's no classes
//     if (item.classList) {
//       // return the item.classList that contains meal-info
//       return item.classList.contains("meal-info");
//     } else {
//       // else will return false and nothing's going to happen
//       return false;
//     }
//   });

//   console.log(mealInfo);
// });

/* ISSUE WITH .PATH METHOD AND HAVE TO NOW USE COMPOSEDPATH METHOD : was getting back the error ''Uncaught TypeError: Cannot read properties of undefined
(reading 'find') at HTMLDivElement.<anonymous> ' and it was due to the '.path' not being usable anymore. He put this in the Q&A: 
"
The e.path property in JavaScript is deprecated and no longer works in modern browsers.
You should use the e.composedPath() method instead. The composedPath() method returns an array of objects representing the elements in the event flow, in the correct execution order.

The code that will work is:

mealsEl.addEventListener('click', e => {
  const mealInfo = e.composedPath().find(item => {
    console.log(item);
  })
});  
"
*/
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.composedPath().find((item) => {
    // checking if there is a class
    // if(item.classList) will return false if there's no classes
    if (item.classList) {
      // return the item.classList that contains meal-info
      return item.classList.contains("meal-info");
    } else {
      // else will return false and nothing's going to happen
      return false;
    }
  });
  // console.log(mealInfo);
  // now when we click on the individual meal, can see in the console log it gives us the element with the meal info and the data-mealid
  /* now let's check for meal-info - if it exists then create a variable called mealID and set that to meal info and can use the getAttribute method to get the
  attribute of 'data-mealid': */
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    // seeing if that works using console log - it does and just returns the plain meal id digits and nothing else
    // console.log(mealID);
    // now we will pass this into a function called 'getMealById' (then will create that function at the top):
    getMealByID(mealID);
  }
});
