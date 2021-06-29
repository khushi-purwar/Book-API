let books = [
    {
        ISBN : "12345ONE",
        title: "Getting Started with MERN",
        authors : [1,2,3],
        language : "en",
        pubDate: "2021-07-07",
        numOfPage : 500,
        category: ["Fiction", "Tech", "Web Dev","Programming"],
        publication: 1
    },
    {
        ISBN : "12345TWO",
        title: "Getting Started with Python",
        authors : [1,2],
        language : "en",
        pubDate: "2021-07-07",
        numOfPage : 500,
        category: ["Fiction", "Tech", "Python","Programming"],
        publication: 2
    },
    {
        ISBN : "12345THREE",
        title: "Getting Started with JAVA",
        authors : [2,3],
        language : "en",
        pubDate: "2021-07-07",
        numOfPage : 500,
        category: ["Fiction", "Tech", "Java","Programming"],
        publication: 3
    }
];

let authors = [
    {
        id: 1,
        name : "Khushi",
        books: ["12345ONE","12345TWO"]
    },
    {
        id: 2,
        name : "Ardushi",
        books: ["12345ONE","12345TWO","12345THREE"]
    },
    {
        id: 3,
        name : "Arman",
        books: ["12345ONE","12345THREE"]
    }
];

const publications = [
    {
        id:1,
        name:"Chakra",
        books: ["12345ONE"]
    },
    {
        id:2,
        name:"Chakri",
        books: ["12345TWO"]
    },
    {
        id:3,
        name:"Takri",
        books: ["12345THREE"]
    }
];

module.exports = {books, authors, publications};