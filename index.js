import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
let tweetData = {}

document.addEventListener('click', function(e){

    

    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
       
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.dataset.delete){
        //console.log(e.target.dataset.delete.split(" "))
        handleDeleteClick(e.target.dataset.delete.split(" "))
    }
    else if(e.target.dataset.replyTweet){
        
        handleTweetBtnReply(e.target.dataset.replyTweet)
        
    }
    else if(e.target.id === 'tweet-btn'){ 
        handleTweetBtnClick()
    } 

})
 
function handleLikeClick(tweetId){ 

    const targetTweetObj = tweetData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    console.log("this is" + targetTweetObj)


    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleDeleteClick(tweetId){
    const targetTweetObj = tweetData.filter(function(tweet){
        return tweet.uuid === tweetId[0]
    })[0]

    let newReplies = targetTweetObj.replies.filter(function(rep){
        return rep.uuid !== tweetId[1]
    }) 

    targetTweetObj.replies = newReplies
    //targetTweetObj.replies.pop()
    render()
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    
   

    if(tweetInput.value){
        tweetData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }
 
}

function handleTweetBtnReply(tweetId){
    console.log(tweetId)
    const targetTweetObj = tweetData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    console.log("this is" + targetTweetObj)
    const tweetInput = document.getElementById(`tweet-reply-input-${tweetId}`)
    console.log(tweetInput.value)
    if(tweetInput.value){
        targetTweetObj.replies.push({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: tweetInput.value,
            uuid: uuidv4() 
        })
    render()
    document.getElementById(`replies-${tweetId}`).classList.toggle('hidden')
    tweetInput.value = ''
    }
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                if(reply.handle === `@Scrimba`){

                    repliesHtml+=`
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div class="own-tweet">
                                    <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p> 
                                    </div>
                                    <i class="fa-solid fa-trash delete-icon"data-delete="${tweet.uuid} ${reply.uuid}"></i>           
                                                                    
                                </div>
                            </div>
                    </div>
                    `
                }
                else{

                    repliesHtml+=`
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>
                    `

                }

            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">        
		<div class="tweet-reply-area">
			<img src="images/scrimbalogo.png" class="profile-pic-reply">
			<textarea placeholder="Tweet your answer" id="tweet-reply-input-${tweet.uuid}" class ="reply-input" ></textarea>
		</div>
        <div class="btn-reply-container">
		    <button class="tweet-reply-btn" data-reply-tweet="${tweet.uuid}">Reply</button>
        </div>
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
    localStorage.setItem("tweets",JSON.stringify(tweetData))
    
}
if(localStorage.getItem("tweets")){
    tweetData = JSON.parse(localStorage.getItem("tweets"))
    console.log("local" + tweetData)
}
else{
    tweetData = tweetsData //
    console.log("unexistent" + tweetData)
}


render()
//localStorage.clear() 


