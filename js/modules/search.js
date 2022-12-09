let searchSwitch = document.getElementById('search');
let searchInput = document.getElementById('localSearchInput');
searchSwitch.addEventListener('change', e => {
  (e.target.checked) ? searchInput.focus() : null;
});

var search = (path, searchSection, resultSection, icons) => {
  'use strict';

  $.ajax({
    url: path,
    dataType: 'xml',
    success: xmlResponse => {
      let search, entries, data;

      let optionsContainer = document.getElementsByClassName('options')[0];
      let optionsInputs = [...optionsContainer.getElementsByClassName('input')];
      let selectInputs = [...document.getElementsByClassName('selectInput')];

      // Select the 'search' element from the XML response
      search = xmlResponse.documentElement;

      // Select all the 'entry' elements inside 'search' element 
      entries = getElementsFrom(search, 'entry', true);

      // Get all the parts of data from each 'entry'
      data = entries.map(entry => {
        let titleNode, publishedNode, modifiedNode, contentNode, urlNode, categoryNodes, tagNodes, categories, tags;

        // some of 'categories' & 'tags' have a subElements inside
        // each of them, this selects the parent elements of them
        categories = getElementsFrom(entry, 'categories', false)[0];
        tags = getElementsFrom(entry, 'tags', false)[0];

        // Select the parts of data inside 'entry' element
        titleNode = getElementsFrom(entry, 'title', true)[0];
        publishedNode = getElementsFrom(entry, 'published', true)[0];
        modifiedNode = getElementsFrom(entry, 'modified', true)[0];
        contentNode = getElementsFrom(entry, 'content', true)[0];
        urlNode = getElementsFrom(entry, 'url', true)[0];

        // Select subElements inside the parent elements
        categoryNodes = getElementsFrom(categories, 'category', true);
        tagNodes = getElementsFrom(tags, 'tag', true);

        // Return an object that contains the parts of data
        return {
          title: titleNode.textContent.trim(),
          published: publishedNode.textContent.trim(),
          modified: modifiedNode.textContent.trim(),
          content: contentNode.textContent.trim(),
          url: urlNode.textContent,
          categories: categoryNodes,
          tags: tagNodes
        }
      });

      // Remove the HTML tags inside the data
      data.forEach(dataPiece => {
        Object.keys(dataPiece).forEach(key => {
          if (key == 'categories' || key == 'tags') {
            dataPiece[key].forEach((item, i) => {
              dataPiece[key][i] = item.textContent.replace(/<[^>]+>/g, '');
            });
          } else {
            dataPiece[key] = dataPiece[key].replace(/<[^>]+>/g, '');
          }
        });
      });

      // Search for the keywords each time input value changes
      searchSection.addEventListener('input', e => {
        handleSearch(e.target, data);
      });

      optionsInputs.forEach(optionInput => {
        optionInput.addEventListener('change', () => {
          let searchOptions = [];

          // Each time an 'optionInput' checked/unchecked, get all of
          // the checked options then store it in the cookies
          optionsInputs.map(optionInput => {
            if (optionInput.checked) {
              searchOptions.push(optionInput.value);
            }
          });

          searchOptions = JSON.stringify(searchOptions);

          setCookie('searchOptions', searchOptions);
          handleSearch(searchSection, data);
        });
      });

      // Update the search results each time the user changes the
      // range of the date of the displayed results
      selectInputs.forEach(selectInput => {
        selectInput.addEventListener('change', () => {
          handleSearch(searchSection, data);
        })
      });
    }
  })
}

/**
 * @function handleSearch
 * @desc Get the matched results index, then get the HTML element
 * of the data that have been searched in
 * @param {Object} e - The target element that is being listened
 * @param {Object} data - The data that is being searched in
 * @return {void}
 */
function handleSearch(e, data) {
  let searchOptions = getSearchOptions();

  // If dateOption is checked, filter the data based on the selected date
  if (searchOptions.includes('date') == true) {
    let fromYear, fromMonth, toYear, toMonth, date, from, to;

    // Get the date from the DOM
    fromYear = document.getElementsByClassName('fromYear')[0].value;
    fromMonth = document.getElementsByClassName('fromMonth')[0].value;
    toYear = document.getElementsByClassName('toYear')[0].value;
    toMonth = document.getElementsByClassName('toMonth')[0].value

    // Create 'from' and 'to' date using 'Date()' class
    from = new Date(fromYear, fromMonth);
    to = new Date(toYear, toMonth);

    date = {
      from: from,
      to: to
    };

    // Filter the data based on the given date
    data = filterDataByDate(data, date);
  }

  // The starting tag of the list element which contains the
  // search results
  let searchResultList = '<ul class="searchResultList">';
  let matchFound = false;
  let resultsNum = 0;
  let resultCount = '';
  let results = '';

  // If input is not empty, do search
  if (e.value.trim().length > 0) {
    let keyword, searchIndex;

    // The value of the search input
    keyword = e.value.trim();

    // Search only inside one piece of data at a time
    data.forEach(dataPiece => {
      // Get the 'Object' that contains the index of
      // the search results
      searchIndex = searchIndexFor(dataPiece, keyword);

      // Check if there is any matched result in this 'dataPiece'
      if (isMatched(searchIndex)) {
        // Add one for each matched result
        ++resultsNum;

        // Match found
        matchFound = true;

        // Create a '<li>' tag to hold the final search results
        results += '<li class="result"><a class="resultLink" href="' + dataPiece.url + '">';

        // Loop through the keys inside 'searchIndex' object
        // to search for each index inside the data
        Object.keys(searchIndex).forEach(key => {

          // Do search only if `key` has a `value` (Not empty)
          if (searchIndex[key].length > 0) {
            // Init variables
            let searchInside, startTag, endTag, matchedHTML;

            // Search inside the 'title' of the posts if `key` is
            // for posts' 'title'
            if (key == 'titleIndex') {
              searchInside = 'title';
              startTag = '<h3 class="searchResultTitle">';
              endTag = '</h3>';
            }

            // Search inside the 'content' of the posts if `key` is
            // for posts' 'content'
            if (key == 'contentIndex') {
              searchInside = 'content';
              startTag = '<p class="searchResultContent">';
              endTag = ' ...</p>';
            }

            // Search inside the 'categories' of the posts if `key` is
            // for posts' 'categories'
            if (key == 'categoryIndex') {
              searchInside = 'categories';
              startTag = '<ul class="categoriesContainer"><span class="icon">' + icons.categories + '</span>';
              endTag = '</ul>';
            }

            // Search inside the 'tags' of the posts if `key` is
            // for posts' 'tags'
            if (key == 'tagIndex') {
              searchInside = 'tags';
              startTag = '<ul class="tagsContainer"><span class="icon">' + icons.tags + '</span>';
              endTag = '</ul>';
            }

            // Substring the result content based on 'searchIndex'
            // and get the HTML element of search result
            matchedHTML = getElementOfMatchedText(dataPiece[searchInside], searchIndex[key], startTag, endTag);

            // Add the title content to the search result
            results += matchedHTML;
          }
        });

        results += '</a></li>';
      }
    });
  }

  // If there any matched results, show result count
  if (resultsNum > 0) {
    resultCount = '<p class="resultsNum">About ' + resultsNum + ' results</p>';
  }

  searchResultList += resultCount + results;

  // Close the 'ul' tag the add search result to the DOM
  searchResultList += '</ul>';

  // Show '.noMatch element if there is no match result
  document.getElementsByClassName('noMatch')[0].classList.toggle('show', matchFound == false && e.value.trim().length > 0);

  resultSection.innerHTML = searchResultList;
}

/**
 * @function filterDataByDate
 * @desc Exclude posts that are not inside the range of the given
 * date then return the filtered data
 * @param {Object} data - Unfiltered data
 * @param {Object} date - Range of date
 * @return {Object} filteredData - Filtered data
 */
function filterDataByDate(data, date) {
  let publishDate, filteredData = [];

  data.forEach(dataPiece => {
    publishDate = new Date(dataPiece.published);

    // If the post published within the date range, then push it to
    // filteredData
    if (publishDate >= date.from && publishDate <= date.to) {
      filteredData.push(dataPiece);
    }
  });

  return filteredData;
}

/**
 * @function searchIndexFor
 * @desc Takes the data object and the keyword, then it finds the
 * index of the searched keyword inside the data parts, then returns
 * an object contains the indexes of the keywords in the data object
 * @param {Object} data
 * @param {String} keyword
 * @return {Object} searchIndex
 */
function searchIndexFor(data, keywords) {
  let searchOptions, keywordRegExp, flag;

  // Store the index values in form 
  // '[keywordIndex, keywordLength]'
  let searchIndex = {
    titleIndex: [],
    contentIndex: [],
    categoryIndex: [],
    tagIndex: []
  };

  // Get the search options then search based on its values
  searchOptions = getSearchOptions();

  // Generate 'regExp' based on 'caseSensitive' is on
  flag = '';

  // Generate 'regExp' based on 'caseSensitive' is off
  if (searchOptions.includes('caseSensitive') == false) {
    flag = 'i';
  }

  // Split the keyword into parts if 'matchWord' is off
  if (searchOptions.includes('matchWord') == true) {
    keywordRegExp = new RegExp('\\b' + keywords + '\\b', flag);
    keywords = [keywords];
  } else {
    keywordRegExp = new RegExp(keywords, flag);
    keywords = keywords.split(/[\s\-]+/);
  }

  // Searching for the keyword inside the pieces of data based on
  // 'searchOptions' values
  Object.keys(data).forEach(key => {
    let matchIndex, keywordLen;

    keywords.forEach(keyword => {
      // Search inside 'title' if title option is switched on
      if (searchOptions.includes('title') && key == 'title') {
        searchIndex.titleIndex.push(data[key].search(keywordRegExp));
        searchIndex.titleIndex.push(keyword.length);
      }

      // Search inside 'content' if content option is switched on
      if (searchOptions.includes('content') && key == 'content') {
        searchIndex.contentIndex.push(data[key].search(keywordRegExp));
        searchIndex.contentIndex.push(keyword.length);
      }

      // Search inside 'category' if category option is switched on
      if (searchOptions.includes('category') && key == 'categories') {
        // Search inside all cells of categories
        data[key].forEach(category => {
          let index = [category.search(keywordRegExp), keyword.length];
          searchIndex.categoryIndex.push(index);
        });
      }

      // Search inside 'tag' if tag option is switched on
      if (searchOptions.includes('tag') && key == 'tags') {
        // Search inside all cells of tags
        data[key].forEach(tag => {
          let index = [tag.search(keywordRegExp), keyword.length];
          searchIndex.tagIndex.push(index);
        });
      }
    });
  });

  return searchIndex;
}

/**
 * @function isMatched
 * @desc It doesn't look a good idea if it only shows the data that has 
 * the same search keyword, this function checks if there is one match 
 * result at least so all the data of this dataPiece will appear in the 
 * search result, but only matched keywords will be highlighted
 * @param {Object} searchIndex - The search index of the piece of data
 * that is being searched in
 * @return {Boolean} found - The result of the check
 */
function isMatched(searchIndex) {
  let found = false;

  Object.keys(searchIndex).forEach(key => {
    if (searchIndex[key].length > 0) {
      if (typeof searchIndex[key][0] == 'object') {
        searchIndex[key].forEach(search => {
          if (search[0] >= 0) {
            found = true;
            return;
          }
        });
      } else {
        if (searchIndex[key][0] >= 0) {
          found = true;
          return;
        }
      }
    }
  });

  return found;
}

/**
 * @function getElementOfMatchedText
 * @desc Search for the index of the matched keyword inside the data
 * object then insert the content to HTML element
 * @param {String/Array} dataPiece - The piece of data that contains
 * the data to search in
 * @param {Array} searchIndex - The Array that contains the index of the
 * matched content
 * @param {String} startTag - The opening tag that will hold the matched
 * content
 * @param {String} endTag - The ending tag that will hold the matched
 * content
 * @return {String} matchedHTML - The HTML element that contains the
 * matched content
 */
function getElementOfMatchedText(dataPiece, searchIndex, startTag, endTag) {
  let matchedHTML, showedContentStart, showedContentEnd, matchedKeyword, keyword, matchedRange, matchedContent;

  // If the searchIndex contains nested arrays, do 'recursion' to search
  // inside all the nested array
  if (typeof searchIndex[0] == 'object') {
    matchedHTML = [];

    // The opening and closing tags of the items inside the array
    let itemStartTag = '<li class="searchedItem"><span class="searched">';
    let itemsEndTag = '</span></li>';

    // Search inside each item in the array
    for (let i = 0; i < searchIndex.length; i++) {

      if (typeof dataPiece[i] != 'undefined' && searchIndex[i][0] >= 0) {
        // Synchronize the search process between the array which contains
        // the data, and the array which contains the search index
        matchedHTML.push(getElementOfMatchedText(dataPiece[i], searchIndex[i], itemStartTag, itemsEndTag));
      }
    }

    // Don't show tags or categories if there aren't any match results
    if (matchedHTML.length > 0) {
      // Convert 'matchedHTML' from 'Array' to 'String'
      matchedHTML = matchedHTML.join('');
      // Add the original opening and closing tag to 'matchedHTML'
      matchedHTML = startTag + matchedHTML + endTag;
    }

    return matchedHTML;
  }

  // Get the matched keyword index
  matchedKeyword = searchIndex[0];
  // Get the length of the matched keyword
  matchedRange = searchIndex[1];

  if (matchedKeyword >= 0) {
    // The beginning of the content that will appear on the
    // search result is before the matched
    // keyword by 20 character
    showedContentStart = matchedKeyword - 20;
    // The end of the content that will appear on the
    // search result is after the matched
    // keyword by 80 character
    showedContentEnd = matchedKeyword + matchedRange + 80;

    // If there aren't 20 character before the matched
    // keyword, the beginning of the content will be
    // in the beginning of the content
    if (showedContentStart < 0) {
      showedContentStart = 0;
    }

    // If there aren't 80 character after the matched
    // keyword, the end of the content will be
    // in the end of the content
    if (showedContentEnd > dataPiece.length) {
      showedContentEnd = dataPiece.length;
    }

    // Slice the matched keyword inside the content based
    // on the index of the matched keyword and the length
    // of the keyword
    keyword = dataPiece.substring(matchedKeyword, matchedKeyword + matchedRange);

    // Slice the content that will appear in the search result
    matchedContent = dataPiece.substring(showedContentStart, showedContentEnd);

    // Add HTML tag to the keyword to highlight it
    matchedContent = matchedContent.replace(keyword, '<em class="searchKeyword">' + keyword + '</em>');
  }

  if (matchedContent) {
    // Marge the matched content with HTML element
    matchedHTML = startTag + matchedContent + endTag;
  } else {
    // If there is no matched results, return the current 'dataPiece'
    if (dataPiece.length >= 100) {
      dataPiece = dataPiece.substring(0, 100);
    }

    matchedHTML = startTag + dataPiece + endTag;
  }

  return matchedHTML;
}

/**
 * @function getSearchOptions
 * @desc Get all checked searchOptions
 * @param {}
 * @return {Array} searchOptions
 */
function getSearchOptions() {
  // Get all the inputs which only inside 'options' div
  let optionsContainer = document.getElementsByClassName('options')[0];
  let optionsInputs = Array.from(optionsContainer.getElementsByClassName('input'));

  // Initialize a variable to store the checked searchOption
  let searchOptions = [];

  // Loop through 'optionsInputs' and store the value of the checked
  // 'optionInput' inside 'searchOptions'
  optionsInputs.map(optionInput => {
    if (optionInput.checked) {
      searchOptions.push(optionInput.value);
    }
  });

  return searchOptions;
}