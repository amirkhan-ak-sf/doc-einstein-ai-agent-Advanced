// Event listener for the send button
document.getElementById('send-btn').addEventListener('click', function () {
  sendMessage();
});

// Event listener for theme toggle
document.getElementById('theme-toggle').addEventListener('change', function () {
  document.body.classList.toggle('dark-theme');
});

// Event listener for pressing Enter key in the input field
document.getElementById('user-input').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

async function sendMessage() {
  let userInput = document.getElementById('user-input').value;
  if (!userInput) return;

  addMessage('user', userInput);
  document.getElementById('user-input').value = ''; // Clear the input field

  try {
    const response = await fetch('https://rfp-einstein-advanced-rag-kkvkik.5sc6y6-4.usa-e2.cloudhub.io/promp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ question: userInput }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.aiResponse.generatedText;
    const parts = generatedText.split('`');

    const pElement = document.createElement('p');

    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Text outside backticks
        pElement.appendChild(document.createTextNode(parts[i]));
      } else {
        // Text inside backticks
        const codeElement = document.createElement('code');
        codeElement.style.backgroundColor = '#ffffff'; // Change the background color here
        codeElement.style.color = '#008000'; // Change the font color here
        codeElement.appendChild(document.createTextNode(parts[i]));
        pElement.appendChild(codeElement);
      }
    }

    const text = pElement.outerHTML.replace(/\n/g, '<br>')

    //updateIndicators(data.generation.contentQuality.scanToxicity.categories);
    console.log(text);

    //loadingMessageElement.remove();

    addMessage('bot', text);
  } catch (error) {
    addMessage('bot', 'Error: Unable to communicate with the AI.');
    console.error('Error:', error);
  } finally {
    // Enable the input field and the send button
    document.getElementById('user-input').disabled = false;
    document.getElementById('send-btn').disabled = false;
    document.getElementById('user-input').focus();
    currentMessageIndex = 0;
  }
}


function updateIndicators(categories) {
  //initializeIndicators();
  categories.forEach(category => {
    const indicator = document.getElementById(`${category.categoryName.toLowerCase()}-indicator`);
    if (indicator) {
      indicator.textContent = `${category.categoryName}: ${category.score.toString()}`; // Set the text content of the indicator to the category name and score
      if (category.score === 0) {
        indicator.classList.add('green');
        indicator.classList.remove('orange');
      } else {
        indicator.classList.add('orange');
        indicator.classList.remove('green');
      }
    }
  });
}

function addMessage(sender, message) {
  let outputDiv = document.getElementById('output');
  let messageDiv = document.createElement('div');
  messageDiv.classList.add(sender);
  messageDiv.innerHTML = message;
  outputDiv.appendChild(messageDiv);

  // Auto-scroll to the bottom
  messageDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function formatReply(reply) {
  // Assuming `reply` is a plain text string
  return reply.replace(/\n/g, '<br>');
}

// Function to add the introductory message from the bot
function addIntroMessage() {
  const introMessage = `Hi, I'm Einstein, an AI Agent built with the MAC Project on the MuleSoft Anypoint Platform.
I have been specialized on MuleSoft Documentation and trained to know almost everything from docs.mulesoft.com.
  `;
  addMessage('bot', introMessage);
}

// Add the introductory message when the page loads
window.onload = function () {
  addIntroMessage();
  initializeIndicators();
};

function initializeIndicators() {
  const categories = [
    'identity',
    'profanity',
    'hate',
    'violence',
    'sexual',
    'physical'
  ];

  categories.forEach(category => {
    const indicator = document.getElementById(`${category}-indicator`);
    if (indicator) {
      indicator.classList.add('green');
      indicator.classList.remove('orange');
    }
  });
}
