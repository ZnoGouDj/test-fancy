function renderItem(state = "weather") {
    fetch(`https://source.unsplash.com/1600x900/?${state}`).then((response) => {
    //   document.getElementById('item').innerHTML = `<img class="beach-image" src="${response.url}" alt="beach image"/>`;
      document.body.setAttribute('style',`background:url("${response.url}") no-repeat center center fixed`); //NEED TO ADD OPACITY SOMEHOW
    }) 
}

export {renderItem};