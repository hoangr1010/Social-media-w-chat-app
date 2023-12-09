import { createSlice } from "@reduxjs/toolkit";

const authInitialState = {
    mode: "light",
    user: null,
    token: null,
    posts: [],
}

const profileInitialState = {
    friends: [],
}

const chatInitialState = {
    chats: [],
    currChatId: null,
    currMessage: []
};

const authSlice = createSlice({
    name: "auth",
    initialState: authInitialState,
    reducers: {
        setMode(state) {
            state.mode = state.mode==="light" ? "dark" : "light";
        },
        setLogin(state,action) {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout(state) {
            state.user = null;
            state.token = null;
        },
        setFriends(state,action) {
            if (state.user) {
                state.user.friends = action.payload;
            } else {
                console.error("There is no user");
            }
        },
        setPosts(state,action) {
            state.posts = action.payload;
        },
        updatePost(state,action) {
            const updatedPosts = state.posts.map((post) => {
                if (post._id===action.payload._id) {
                    return action.payload
                } else {
                    return post;
                }
            })
            state.posts = updatedPosts;
        }
    }
})

const profileSlice = createSlice({
    name: 'profile',
    initialState: profileInitialState,
    reducers: {
        setProfileFriends(state,action) {
            state.friends = action.payload;
        }
    }
})

const chatSlice = createSlice({
    name: 'chat',
    initialState: chatInitialState,
    reducers: {
        setChat(state,action) {
            state.chats = action.payload;
        },
        updateChat(state, action) {
            const { chatId } = action.payload;
            
            const updatedChatList = state.chats.map(chat => {
                if (chat.chatId == chatId) {

                    if (action.payload.lastMessage) {
                        chat.lastMessage = action.payload.lastMessage
                    }

                };
                return chat
            })

            state.chats = updatedChatList;
        },
        setMessage(state, action) {
            state.currMessage = action.payload;
        },
        updateMessage(state, action) {
            state.currMessage.push(action.payload);
        },
        setCurrChatId(state, action) {
            state.currChatId = action.payload;
        }
    }
})


export const { setMode, setLogin, setLogout, setFriends, setPosts, updatePost} = authSlice.actions;
export const { setProfileFriends } = profileSlice.actions;
export const { setChat, updateChat, setMessage, updateMessage, setCurrChatId } = chatSlice.actions;
export default {
    authReducer: authSlice.reducer,
    profileReducer: profileSlice.reducer,
    chatReducer: chatSlice.reducer
};