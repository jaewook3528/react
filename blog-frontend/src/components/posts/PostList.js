import React , {  useState }from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Responsive from '../common/Responsive';
import Button from '../common/Button';
import palette from '../../lib/styles/palette';
import SubInfo from '../common/SubInfo';
import Tags from '../common/Tags';

const PostListBlock = styled(Responsive)`
  margin-top: 3rem;
`;

const WritePostButtonWrapper = styled.div`
  display: flex;
  height:50px;
  justify-content: flex-end;
  margin-bottom: 3rem;
  border: 1px solid #dddddd;
`;

const SearchWrapper = styled.div`
  display: flex;
  height:50px;
  width:300px;
  margin-bottom: 3rem;
  border: 1px solid #dddddd;
`;

const PostItemBlock = styled.div`
  padding-top: 3rem;
  padding-bottom: 3rem;
  /* 맨 위 포스트는 padding-top 없음 */
  &:first-child {
    padding-top: 0;
  }
  & + & {
    border-top: 1px solid ${palette.gray[2]};
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 0;
    margin-top: 0;
    &:hover {
      color: ${palette.gray[6]};
    }
  }
  p {
    margin-top: 2rem;
  }
`;



const PostItem = ({ post }) => {
    const { publishedDate, user, tags, title, body, _id } = post;
    return (
      <PostItemBlock>
        <h2>
          <Link to={`/@${user.username}/${_id}`}>{title}</Link>
        </h2>
        <SubInfo
          username={user.username}
          publishedDate={new Date(publishedDate)}
        />
        <Tags tags={tags} />
        <p>{body}</p>
      </PostItemBlock>
    );
  };

  const PostList = ({ posts, loading, error, showWriteButton }) => {
    const [search, setSearch] = useState('');
  
    const onChangeSearch = e => {
      setSearch(e.target.value);
    };

    const onKeyPressSearch = e => {
      if (e.key === 'Enter') {
        e.preventDefault(); // 기본 동작 방지
        // 검색 실행
        console.log('searching...');
      }
    };
  
    const getSearchedPosts = () => {
      if (!search) {
        return posts;
      } else {
        return posts.filter(post =>
          Object.values(post).some(value =>
            typeof value === 'string' && value.toLowerCase().includes(search.toLowerCase())
          )
        );
      }
    };
  
  
    if (error) {
      return <PostListBlock>에러가 발생했습니다.</PostListBlock>;
    }
  
    return (
      <PostListBlock>
        <WritePostButtonWrapper>
          <SearchWrapper>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={search}
              onChange={onChangeSearch}
              onKeyPress={onKeyPressSearch}
            />
          </SearchWrapper>
          {showWriteButton && (
            <Button cyan to="/write">
              새 글 작성하기
            </Button>
          )}
        </WritePostButtonWrapper>
        {!loading && posts && (
          <div>
            {getSearchedPosts().map(post => (
              <PostItem post={post} key={post._id} />
            ))}
          </div>
        )}
      </PostListBlock>
    );
  };

export default PostList;