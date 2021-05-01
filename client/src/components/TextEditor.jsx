import { useCallback } from 'react'

import Quill from 'quill'
import 'quill/dist/quill.snow.css'

function TextEditor() {
  //const quillWrapperRef = useRef()

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
    new Quill(editor, { theme: 'snow' })

    // useEffect's cleanup
    // return () => {
    //   wrapper.innerHTML = ''
    // }
  }, [])

  return <div className='quill-container' ref={quillWrapperRef}></div>
}

export default TextEditor
