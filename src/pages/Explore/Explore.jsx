import React, { useState } from 'react'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'

const Explore = () => {
  const [category, setCategory] = useState('All')
  const [searchText, setSearchText] = useState('')
  return (
    <>
      <div className='container'>
        <div className='row justify-content-center '>
          <div className='col-md-6'>
            <form onSubmit={e => e.preventDefault()}>
              <div className='input-group mb-3'>
                <select 
                  className='form-select mt-2' 
                  style={{'maxWidth':'200px'}}
                  onChange={e => setCategory(e.target.value)}  
                >
                  <option value="All">Select category</option>
                  <option value="BIRYANI">BIRYANI</option>
                  <option value="CAKE">CAKE</option>
                  <option value="BURGER">BURGER</option>
                  <option value="PIZZA">PIZZA</option>
                  <option value="ROLLS">ROLLS</option>
                  <option value="SALAD">SALAD</option>
                  <option value="ICE CREAM">ICE CREAM</option>
                  <option value="COLD DRINK">COLD DRINK</option>
                </select>
                <input 
                  type='text' 
                  className='form-control mt-2' 
                  placeholder='Search...' 
                  onChange={e => setSearchText(e.target.value)}
                  value={searchText}
                ></input>
                <button className='btn btn-primary mt-2' type='submit'>
                  <i className='bi bi-search'></i>
                </button> 
              </div>
            </form>
          </div>
        </div>
      </div>
      <FoodDisplay category={category} searchText={searchText} />
    </>
  )
}

export default Explore