document.addEventListener('DOMContentLoaded', () => {
  const imageBefore = document.getElementById('imageBefore')
  const imageAfter = document.getElementById('imageAfter')
  const downloadBefore = document.getElementById('downloadBefore')
  const downloadAfter = document.getElementById('downloadAfter')
  const titleBefore = document.getElementById('titleBefore')
  const titleAfter = document.getElementById('titleAfter')
  const input = document.getElementById('imageInput')
  const drop = document.getElementById('dropArea')
  const outputArea = document.getElementById('outputArea')
  const loader = document.getElementById('loader')

  drop.addEventListener('click', onClick)
  drop.addEventListener('dragenter', onDragEnter)
  drop.addEventListener('dragstart', onDragStart)
  drop.addEventListener('dragover', onDragOver)
  drop.addEventListener('dragleave', onDragLeave)
  drop.addEventListener('dragend', onDragEnd)
  drop.addEventListener('drop', onDrop)

  let blobBefore = null
  let blobAfter = null

  function onClick() {
    input.click()
  }

  function onDragEnter(e) {
    e.target.classList.add('is-dragover')
  }

  function onDragStart(e) {
    e.target.style.opacity = 0.5
  }

  function onDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    return false
  }

  function onDragLeave(e) {
    e.target.classList.remove('is-dragover')
  }

  function onDragEnd(e) {
    return false
  }

  function onDrop(e) {
    e.stopPropagation()
    e.preventDefault()

    if (e.dataTransfer.files.length === 0) {
      return false
    }

    blobBefore && URL.revokeObjectURL(blobBefore)
    blobAfter && URL.revokeObjectURL(blobAfter)

    let file = e.dataTransfer.files[0]
    blobBefore = file.slice(0, file.size)

    downloadBefore.download = file.name
    downloadAfter.download = file.name.replace(/(jpeg|jpg|png)/, 'webp')

    sendBlob(blobBefore, xhr => {
      blobAfter = xhr.response
      downloadAfter.href = imageAfter.src = URL.createObjectURL(blobAfter)
    })

    downloadBefore.href = imageBefore.src = URL.createObjectURL(blobBefore)
  }

  input.addEventListener('change', e => {
    blobBefore && URL.revokeObjectURL(blobBefore)
    blobAfter && URL.revokeObjectURL(blobAfter)

    let file = input.files[0]
    blobBefore = file.slice(0, file.size)

    downloadBefore.download = file.name
    downloadAfter.download = file.name.replace(/(jpeg|jpg|png)/, 'webp')

    sendBlob(blobBefore, xhr => {
      blobAfter = xhr.response
      downloadAfter.href = imageAfter.src = URL.createObjectURL(blobAfter)
    })

    downloadBefore.href = imageBefore.src = URL.createObjectURL(blobBefore)
  })

  function sendBlob(blob, callback) {
    loader.classList.remove('hide')
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/cwebp', true)
    xhr.responseType = 'blob'
    xhr.onload = e => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        callback(xhr)
        const responseSize = xhr.response.size
        const sizeAfter =
          responseSize > 1000000
            ? `${Math.floor((responseSize / 1000000) * Math.pow(10, 1)) /
                Math.pow(10, 1)}MB`
            : responseSize > 1000
              ? `${Math.round(responseSize / 1000)}KB`
              : `${responseSize}B`
        titleAfter.innerHTML = `after <small>(${sizeAfter})</small>`
        loader.classList.add('hide')
      }
    }
    xhr.send(blob)
    outputArea.classList.remove('hide')
    const sizeBefore =
      blob.size > 1000000
        ? `${Math.floor((blob.size / 1000000) * Math.pow(10, 1)) /
            Math.pow(10, 1)}MB`
        : blob.size > 1000
          ? `${Math.round(blob.size / 1000)}KB`
          : `${blob.size}B`
    titleBefore.innerHTML = `before <small>(${sizeBefore})</small>`
  }
})
// Math.floor((blob.size / 1000000) * Math.pow(10, 1)) / Math.pow(10, 1)
