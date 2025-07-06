# Chat Market MVP Scope
What do we want to demonstrate for the hackathon? \
Here are the features within the scope of the MVP for the hackathon.

## Sell Journey
- [ ] **Sell Chat**
  - [ ] User can list for sale using the chat
  - [ ] AI creates a chat title by summarizing the item in the conversation
  - [ ] User can submit an image, and AI will infer its description and condition
  - [ ] AI can decide which image to use as the main listing image
  - [ ] AI can advise on the value of the item by fetching prices of similar items in our database

- [ ] **Manage Listings**
  - [ ] User see their current listings, edit them, and change their status

## Buy Journey
- [ ] **Buy Chat**
  - [ ] User can ask for an item and AI will search the market (our database only) for items based on the conversation. The items proposed appear in the chat interface.
    - [ ] Need to parameterize the items (e.g. category)
  - [ ] AI refines its search as more information is added to the conversation by the user, and proposes further items
  - [ ] User can tap on the item in the chat and it opens a listing modal
  - [ ] User can activate “AI Market Monitor” which enables the AI to keep searching for matching items whilst the user is offline, and send new proposals as new chat messages. **Important to have - demonstate autonomous agent**

- [ ] **Manage Buy Chats**
  - [ ] User can see all of their buy chats in a list, allowing them to go back to a particular chat
  - [X] User can access “Buy Chat Options” from the My Buy Chats list by clicking on the 3-dot menu
  - [ ] “New Matches” notification appears as a badge on a chat card when the AI Market Monitor has found new matches for this chat

## Bonus
- [ ] Maximum frequency of notifications can be set using a “Buy Chat Options” modal.
- [ ] User can use voice to chat instead of typing
- [ ] AI can give information about historical price trends of this item
- [ ] When buying, user can also search by image 
- [ ] User gets notification when item sells

## AI agent scope	
Prioritization: p 1 = highest, p 3 = lowest

### SELLER SIDE AGENTS. 1. Seller Conversation Agent - Collects product info, handles images (Groq+Llama)
2. Image Processing Agent - Analyzes product photos (Groq+Llama)- p 1
3. Price Research Agent - Internet price comparison via Tavily API + database (Groq+Llama) -	p 2
4. Listing Agent - Creates database entries, manages inventory -	p 1
5. Validation Agent - Ensures complete listings -	p 1
6. Seller Notification Agent - SMS confirmations via Twilio - p 3
7. 
### BUYER SIDE AGENTS: 	
1. Buyer Conversation Agent - Understands needs, budget, location (Groq+Llama) - p 1
2. Product Search Agent - Database queries by criteria,	1
3. Recommendation Agent - AI-powered matching with location/shipping (Groq+Llama) - p 2
4. Order Processing Agent - Creates orders, updates inventory - p 1
5. Buyer Notification Agent - Purchase confirmations via Twilio - p 3
6. Seller Notification Agent - Sale alerts to sellers - p 3
7. 
### SHARED COMPONENTS: 	
- Analytics Agent - Performance tracking, insights - p 3
- Inventory Management - Stock tracking, availability - p 1
- Order Status System - Pending → Confirmed → Shipped → Delivered - p 2
- Review/Rating Agent - Post-purchase feedback - p 3
- Dispute Resolution Agent - Handle buyer-seller issues -	p 3
- Product Category Agent - Auto-categorize listings -	p 1

### TECH STACK: 	
- uAgents framework for agent communication
- Groq API + Llama for AI agents
- Tavily API for internet price research
- Snowflake database with Python connector
- FastAPI for web interface
- Twilio for SMS notification
