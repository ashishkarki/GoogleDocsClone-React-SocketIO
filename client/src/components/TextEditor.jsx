import { useCallback, useEffect, useState } from 'react'

import Quill from 'quill'
import 'quill/dist/quill.snow.css'

import { io } from 'socket.io-client'

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'blockquote', 'code-block'],
  ['clean'],
]

const TextEditor = () => {
  //const quillWrapperRef = useRef()
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()

  // we just want this connection from client to server happen once
  useEffect(() => {
    const sock = io('http://localhost:3001')
    setSocket(sock)

    return () => {
      sock.disconnect()
    }
  }, [])

  useEffect(() => {
    // when this useEffect first fires socket or quill variables might be undefined
    if (!!!socket === null || !!!quill) return

    const deltaHandler = (delta, oldDelta, source) => {
      if (source !== 'user') return

      socket.emit('send-changes', delta) // send whatever changed in our client to the server
    }

    quill.on('text-change', deltaHandler)

    return () => {
      quill.off('text-change', deltaHandler)
    }
  }, [socket, quill])

  useEffect(() => {
    // when this useEffect first fires socket or quill variables might be undefined
    if (!!!socket === null || !!!quill) return

    const deltaHandler = delta => {
      quill.updateContents(delta)
    }

    socket.on('receive-changes', deltaHandler)

    return () => {
      socket.off('receive-changes', deltaHandler)
    }
  }, [socket, quill])

  const quillWrapperRef = useCallback(wrapper => {
    if (wrapper === null) return

    wrapper.innerHTML = ''

    // create a random div that hosts the quill editor and gets re-instantiated
    // everytime the useEffect finishes running
    const editor = document.createElement('div')

    // put this re-creatable editor inside our Quill-container
    // wrapper.current.append(editor)
    wrapper.append(editor)

    // the reference given to Quill is the editor above so
    // quill puts everything inside this editor which recreated everytime useEffect quits
    const q = new Quill(editor, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS },
    })
    setQuill(q)

    // useEffect's cleanup
    // return () => {
    //   wrapper.innerHTML = ''
    // }
  }, [])

  return <div className='quill-container' ref={quillWrapperRef}></div>
}

export default TextEditor
