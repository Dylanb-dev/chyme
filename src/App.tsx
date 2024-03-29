import React, { useState } from 'react'
import logo from './logo.svg'
import {
  Page,
  useMediaQuery,
  Text,
  Row,
  Button,
  ButtonDropdown,
  Avatar,
  Card,
  Popover,
  Image,
  Spacer,
  Input,
  Col,
  AutoComplete,
} from '@zeit-ui/react'
//@ts-ignore
import Coverflow from 'react-coverflow'
import { useAuth } from './firebase-hooks'

import { Power, Menu, Search, ChevronLeft } from '@zeit-ui/react-icons'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from 'react-router-dom'
import { brandPrimary } from './theme'
//Views
import { StreamView } from './StreamView'
import { StartStreamView } from './StartStreamView'
import { DashboardView } from './DashboardView'

const Logo = ({ white }: { white?: boolean }) => (
  <Text size={24} style={{ color: white ? 'white' : brandPrimary }}>
    Chyme
  </Text>
)
//
const CoverFlowComponent = () => (
  <div
    style={{
      width: '100%',
    }}
  >
    <Coverflow
      width="auto"
      height="500"
      displayQuantityOfSide={2}
      navigation={false}
      enableScroll={false}
      clickable={true}
      active={0}
      media={{
        '@media (max-width: 900px)': {
          width: '600px',
          height: '300px',
        },
        '@media (min-width: 900px)': {
          width: '960px',
          height: '600px',
        },
      }}
    >
      <img
        src="https://www.100gecs.com/images/RFPCover.jpg"
        alt="Album one"
        data-action="https://facebook.github.io/react/"
      />
      <img
        src="https://www.100gecs.com/images/RFPCover.jpg"
        alt="Album two"
        data-action="http://passer.cc"
      />
      <img
        src="https://www.100gecs.com/images/RFPCover.jpg"
        alt="Album three"
        data-action="https://doce.cc/"
      />
      <img
        src="https://www.100gecs.com/images/RFPCover.jpg"
        alt="Album four"
        data-action="http://tw.yahoo.com"
      />
    </Coverflow>
  </div>
)

const SearchBox = () => {
  const options = [
    { label: 'London', value: 'london' },
    { label: 'Sydney', value: 'sydney' },
    { label: 'Shanghai', value: 'shanghai' },
  ]
  return (
    <AutoComplete
      clearable
      width="100%"
      placeholder="Enter here"
      options={options}
    />
  )
}

export const Navbar = ({ authUser, signOut, signIn }: any) => {
  const [searchText, setSearchText] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)
  const handler = (e: any) => {
    setSearchText(e.target.value)
    console.log(e.target.value)
  }
  const [visible, setVisible] = useState(false)
  const changeHandler = (next: boolean) => {
    setVisible(next)
  }
  const isWideDisplay = useMediaQuery('md', { match: 'up' })
  const content = () => (
    <>
      <Popover.Item title>
        <span>{authUser?.displayName}</span>
      </Popover.Item>
      <Popover.Item onClick={() => setVisible(false)}>
        <Link to="/start-stream">Start a stream</Link>
      </Popover.Item>
      <Popover.Item onClick={() => setVisible(false)}>
        <Link to="/stream-summary">View your past streams</Link>
      </Popover.Item>
      <Popover.Item onClick={() => setVisible(false)}>
        <Link to="/profile">View your profile</Link>
      </Popover.Item>
      <Popover.Item line />
      <Popover.Item onClick={() => setVisible(false)}>
        <Link to="#" onClick={signOut}>
          Sign out
        </Link>
      </Popover.Item>
    </>
  )
  return isSearchActive ? (
    <>
      <Row
        align="middle"
        style={{
          height: '71px',
          display: 'absolute',
          backgroundColor: brandPrimary,
          paddingRight: isWideDisplay ? '32px' : '16px',
          paddingLeft: isWideDisplay ? '32px' : '16px',
        }}
      >
        <Button
          onClick={() => setIsSearchActive(false)}
          size="large"
          style={{
            minWidth: '44px',
            padding: 0,
            backgroundColor: 'transparent',
            border: 'none',
          }}
          icon={<ChevronLeft color="white" />}
        />
        <Row
          style={{
            background: 'white',
            width: '100%',
            borderRadius: '5px',
            marginRight: '8px',
          }}
        >
          <SearchBox />
        </Row>
      </Row>
    </>
  ) : (
    <Row
      align="middle"
      justify="space-between"
      style={{
        backgroundColor: brandPrimary,
        paddingRight: isWideDisplay ? '32px' : '16px',
        paddingLeft: isWideDisplay ? '32px' : '16px',
      }}
    >
      <Link to="/">
        <Logo white />
      </Link>
      {isWideDisplay ? (
        <Input
          icon={<Search color="white" />}
          value={searchText}
          onChange={handler}
          placeholder="Search"
          clearable
        />
      ) : null}
      <Row align="middle">
        {isWideDisplay ? null : (
          <Button
            onClick={() => setIsSearchActive(true)}
            size="large"
            style={{
              minWidth: '64px',
              padding: 0,
              backgroundColor: 'transparent',
              border: 'none',
            }}
            icon={<Search color="white" />}
          />
        )}
        {authUser ? (
          <Popover
            placement="bottomEnd"
            content={content}
            visible={visible}
            onVisibleChange={changeHandler}
            style={{
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Avatar text={authUser.displayName} />
          </Popover>
        ) : (
          <Button size="small" onClick={signIn}>
            Login
          </Button>
        )}
      </Row>
    </Row>
  )
}

const About = () => <Text h3>About</Text>

const HomeStationCard = () => {
  const history = useHistory()

  return (
    <Card shadow onClick={() => history.push('/stream')}>
      <Row align="middle">
        <div style={{ height: '100px', width: '100px', borderRadius: '4px' }}>
          <Image
            src="https://www.100gecs.com/images/RFPCover.jpg"
            height={100}
            width={100}
            style={{ objectFit: 'cover', borderRadius: '4px' }}
          />
        </div>
        <Col style={{ paddingLeft: '16px', paddingRight: '16px' }}>
          <h4>The Evil Rabbit</h4>
          <p>shadow card.</p>
        </Col>
      </Row>
    </Card>
  )
}

const Home = () => (
  <div>
    <CoverFlowComponent />
    <Page>
      <Text h3 style={{ textAlign: 'left' }}>
        Recommended
      </Text>
      <HomeStationCard />
      <Spacer y={1} />

      <HomeStationCard />
      <Spacer y={1} />
      <Text h3 style={{ textAlign: 'left' }}>
        Just Ended
      </Text>
      <HomeStationCard />
      <Spacer y={1} />

      <HomeStationCard />
    </Page>
  </div>
)

function App() {
  const { authUser, signIn, signOut, isAuthLoading } = useAuth()
  if (isAuthLoading) {
    return <div>Loading</div>
  }
  return (
    <div
      style={{
        backgroundColor: 'lightGray',
        height: '100%',
        width: '100%',
        minHeight: '100vh',
        minWidth: '100vw',
      }}
    >
      <Router>
        <Navbar authUser={authUser} signOut={signOut} signIn={signIn} />
        <Row justify="center">
          <div
            style={{
              maxWidth: '960px',
            }}
          >
            {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/start-stream">
                <StartStreamView />
              </Route>
              {authUser && (
                <Route path="/dashboard">
                  <DashboardView authUser={authUser} />
                </Route>
              )}
              <Route path="/about">
                <About />
              </Route>
              <Route path="/stream">
                <StreamView />
              </Route>
            </Switch>
          </div>
        </Row>
      </Router>
    </div>
  )
}

export default App
