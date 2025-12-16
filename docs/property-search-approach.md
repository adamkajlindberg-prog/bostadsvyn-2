Property Page Search and Filter Approach 

Overview 

In order to enhance the search functionality on the property page, we will be using a dual approach combining Full Text Search (via search index) and RAG (Semantic) Search. 

Approach 

1. Full Text Search and RAG: 

When a user enters a search phrase of 3 words or fewer, we will rely solely on Full Text Search to find relevant properties. 

If the search phrase contains more than 3 words, we will prioritize the RAG (Semantic) Search approach, which understands the meaning behind the search terms for more accurate results. 

2. Fallback Logic: 

While RAG is prioritized for longer search phrases, it is not always guaranteed to return results, especially as its accuracy improves over time. Therefore, we will use Full Text Search as a fallback to display properties if existing. 

3. Filter Logic: 

The filter functionality will remain consistent. Users will send filters such as ?city=stockholm as part of the search parameters. 