import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
      <Link to='/'>Homepage</Link>
      <Link to='/learning'>Learning</Link>
      <Link to='/chord-diagrams'>Chord Diagrams</Link>
      <Link to='/my-songs'>My Songs</Link>

    </>
  )
}

export default Navbar
