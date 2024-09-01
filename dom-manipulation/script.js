  let quotes = [
    { text: "It takes courage to grow up and become who you really are.", category: "Inspiration" },
    { text: "Our greatest glory is not in never falling, but in rising every time we fall.", category: "Success" },
    { text: "Everything you've ever wanted is sitting on the other side of fear.", category: "Motivation" }
  ];

  // Function to load quotes from Local Storage
  function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
      quotes = JSON.parse(savedQuotes);
    }
  }

  // Function to save quotes to Local Storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  // Function to show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex].text;
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.textContent = selectedQuote;
    saveLastViewedQuote(selectedQuote); // Save the last viewed quote to Session Storage
  }

  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();  // Save quotes after adding a new one

      // Clear the input fields
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';

      alert('Quote added successfully!');
    } else {
      alert('Please enter both a quote and a category.');
    }
  }

  // Function to save the last viewed quote to Session Storage
  function saveLastViewedQuote(quote) {
    sessionStorage.setItem('lastViewedQuote', quote);
  }

  // Function to display the last viewed quote on page load
  function displayLastViewedQuote() {
    const lastQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastQuote) {
      const quoteDisplay = document.getElementById('quoteDisplay');
      quoteDisplay.textContent = lastQuote;
    }
  }

  // Function to export quotes to a JSON file
  function exportToJsonFile() {
    const jsonStr = JSON.stringify(quotes);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);  // Clean up after download
  }

  // Function to import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      try {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
      } catch (e) {
        alert('Failed to import quotes. Please ensure the file is in the correct format.');
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }

  // Event listener for showing a new quote
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);

  // Load quotes and display the last viewed quote on page load
  loadQuotes();
  displayLastViewedQuote();


// Simulate server interaction
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Replace with your actual API URL

// Periodically fetch data from server
function fetchServerQuotes() {
  fetch(API_URL)
    .then(response => response.json())
    .then(serverQuotes => {
      handleDataSync(serverQuotes);
    })
    .catch(error => console.error('Error fetching quotes:', error));
}

// Handle server data sync
function handleDataSync(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  
  // Resolve conflicts: Server data takes precedence
  const mergedQuotes = serverQuotes.map(serverQuote => {
    const existingQuote = localQuotes.find(q => q.id === serverQuote.id);
    return existingQuote ? serverQuote : existingQuote;
  });

  // Save merged quotes to local storage
  localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
  populateCategories(); // Update category dropdown
  notifyUser('Your quotes have been updated.');
}

// Post new quote to server
function postQuoteToServer(newQuote) {
  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newQuote),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Quote posted successfully:', data);
    })
    .catch(error => console.error('Error posting quote:', error));
}

// Notify users of updates
function notifyUser(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 5000);
}

// Handle manual conflict resolution
function resolveConflict(choice) {
  if (choice === 'keepServer') {
    fetchServerQuotes();
  }
  document.getElementById('conflictResolution').style.display = 'none';
}

// Periodically fetch data
setInterval(fetchServerQuotes, 5 * 60 * 1000);

  
  