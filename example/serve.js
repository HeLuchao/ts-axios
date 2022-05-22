import axios from '../src/index'
function fetchData() {
  axios({
    method: 'get',
    url: 'https://api.uomg.com/api/rand.avatar',
    params: {
      sort: '男',
      format: 'json'
    }
  })
}
const ele = document.getElementById('btn')
ele.addEventListener('click', () => {
  fetchData()
})
