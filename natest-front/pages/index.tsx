import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PostForm from "../src/components/units/form/PostForm";
import PostCard from "../src/components/units/list/PostCard";
import { LOAD_POSTS_REQUEST } from "../src/commons/reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../src/commons/reducers/user";
import { Modal } from "antd";
import wrapper from "../src/commons/store/configureStore";
import axios from "axios";
import { END } from "redux-saga";
import InfiniteScroll from "react-infinite-scroller";
import { QueryClient } from "react-query";

export default function Home() {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector(
    (state) => state.post
  );

  useEffect(() => {
    if (retweetError) {
      Modal.error({ content: retweetError });
    }
  }, [retweetError]);

  // useEffect(() => {
  //   const onScroll = () => {
  //     if (
  //       window.scrollY + document.documentElement.clientHeight >
  //       document.documentElement.scrollHeight - 300
  //     ) {
  //       if (hasMorePosts && !loadPostsLoading) {
  //         const lastId = mainPosts[mainPosts.length - 1]?.id;
  //         dispatch({
  //           type: LOAD_POSTS_REQUEST,
  //           lastId,
  //         });
  //       }
  //     }
  //   };
  //   window.addEventListener("scroll", onScroll);
  //   return () => {
  //     window.removeEventListener("scroll", onScroll);
  //   };
  // }, [mainPosts, hasMorePosts, loadPostsLoading]);

  // useEffect(() => {
  //   const lastId = mainPosts[mainPosts.length - 1]?.id;
  //   dispatch({
  //     type: LOAD_POSTS_REQUEST,
  //     lastId,
  //   });
  // }, []);

  function onLoadMore() {
    if (!hasMorePosts) return;

    if (hasMorePosts && !loadPostsLoading) {
      const lastId = mainPosts[mainPosts.length - 1]?.id;
      dispatch({
        type: LOAD_POSTS_REQUEST,
        lastId,
      });
    }
  }

  return (
    <>
      {me && <PostForm />}
      <InfiniteScroll
        pageStart={0}
        loadMore={onLoadMore}
        hasMore={hasMorePosts}
        loader={
          <div className="loader" key={0}>
            로딩중입니다 ...
          </div>
        }
      >
        {mainPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </InfiniteScroll>
    </>
  );
}

export const getStaticProps = async () => {
  const queryClient = new QueryClient();
};

// export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
//   console.log("getServerSideProps start");
//   console.log(context.req.headers);
//   const cookie = context.req ? context.req.headers.cookie : "";
//   axios.defaults.headers.Cookie = "";
//   if (context.req && cookie) {
//     axios.defaults.headers.Cookie = cookie;
//   }
//   context.store.dispatch({
//     type: LOAD_POSTS_REQUEST,
//   });
//   context.store.dispatch(END);
//   console.log("getServerSideProps end");
//   await context.store.sagaTask.toPromise();
// });