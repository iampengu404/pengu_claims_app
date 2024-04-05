<template>
  <main>
    <div class="chef"><img src="@/assets/chef.png" /></div>
    <div class="hero">
      <div class="topnav"><div class="logo_desktop"><a href="https://www.pengufoods.xyz"><img src="https://assets-global.website-files.com/65ce4b6e0ff5b1cccd696736/65ce986adaf1eb97e936d747_logo_header.svg" loading="lazy" width="Auto" height="50" alt=""></a></div><div class="nav_buttons"><a href="https://opensea.io/collection/pengu-foods" target="_blank" class="topnav_links w-inline-block"><img src="https://assets-global.website-files.com/65ce4b6e0ff5b1cccd696736/65cfcfcbd533ed5832267bca_opensea.svg" loading="lazy" width="40" height="Auto" alt=""></a></div></div>
      <div class="div_hero">
        

        <div><img src="https://assets-global.website-files.com/65ce4b6e0ff5b1cccd696736/65cf8efed38587746f48c037_orange.png" width="186" class="float"></div>

        <div class="info">Claims have now ended.</div>

        
        <div class="message" v-if="message">{{ message }}</div>

      </div>
    </div>
    <section class="footer">
      <div class="footer_body">
        <div>
          <div class="text-block-4">COPYRIGHT © 2024 PENGU FOODS - TAKE THE BAIT - ALL RIGHTS RESERVED.</div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'
import { isAddress } from 'web3-validator'

export default {
  data() {
    return {
      ownerAddress: null,
      message: null,
      searching: false,
      pudgiesSlugs: ['pudgypenguins', 'lilpudgys', 'pudgyrods'],
      nameLookup: {
        pudgypenguins: 'Pudgy Penguins',
        lilpudgys: 'Lil Pudgys',
        pudgyrods: 'Pudgy Rods'
      }
    }
  },
  methods: {
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async save() {
      // Save to Sheets
      const res = await axios.get(`/api/sheets?address=${this.ownerAddress}`)
      this.message = "Congrats! You'll be receiving $PENGU airdrops soon. 🐟"
    },
    async getOwnedByCollection(collection_slug) {
      // throttle requests and limit to 1 record only for performance
      await this.sleep(3000);
      const url = `https://api.opensea.io/api/v2/chain/ethereum/account/${this.ownerAddress}/nfts?collection=${collection_slug}&limit=1`
      const res = await axios.get(url, { headers: { 'x-api-key': import.meta.env.VITE_OS_KEY } })
      return res.data.nfts
    },
    async getOwnedTokens() {
      const that = this
      this.searching = true
      this.message = null
      var foundNfts = false

      if (!isAddress(this.ownerAddress)) {
        this.message = 'Invalid wallet address'
        this.searching = false
        return
      }

      // loop through all collections. Exit as soon as found
      for (var slug of this.pudgiesSlugs) {
        this.message = `Checking ${this.nameLookup[slug]}...`
        var nfts = await that.getOwnedByCollection(slug)

        if (nfts.length > 0) {
          console.log('Found', slug)
          foundNfts = true
          await this.save()
          break;
        }
      }

      if (!foundNfts) {
        this.message = `Sorry, no NFTs found 😔`  
      }

      this.searching = false
    }
  }
}

</script>

<style>

@keyframes floating {
  0% { transform: translate(0,  0px); }
  50%  { transform: translate(0, 15px); }
  100%   { transform: translate(0, -0px); }    
}

body {
  padding: 0;
  margin: 0;
  background-color: #ff8b8b;
  font-family: "Roboto Flex", sans-serif;
}

.message {
  margin-top: 20px;
  margin-bottom: 20px;
}

.hero {
  background-color: #2edefd;
  background-image: linear-gradient(#7cc2f5, #fff);
  border-bottom: 5px solid #000;
  justify-content: center;
  align-items: flex-start;
  display: flex;
  min-height: 300px;
  min-height: 80vh;
}

.div_hero {
  width: 100%;
  height: auto;
  max-width: 1200px;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 150px;
  margin-bottom: 150px;
  display: flex;
}

.topnav {
  width: 100%;
  height: 70px;
  max-width: 1200px;
  justify-content: space-between;
  align-items: center;
  display: flex;
  position: absolute;
  top: 2px;
}

.float {
  animation-name: floating;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

.heading_shadow_hero {
  color: #fff;
  text-align: center;
  -webkit-text-stroke-width: 3px;
  -webkit-text-stroke-color: #000;
  text-shadow: -3px 2px #000;
  margin-top: 0;
  margin-bottom: 26px;
  font-family: Luckiest Guy, sans-serif;
  font-size: 61px;
  line-height: 61px;
}

.info {
  font-family: Luckiest Guy, sans-serif;
  font-size: 28px;
  text-align: center;
  margin-top: 50px;
}

.traits {
  font-weight: 600;
  margin-top: 10px;
}

input {
  font-size: 20px;
  width: 500px;
  padding: 20px;
  border:3px solid black;
  outline:0;
  font-family: "Roboto Flex", sans-serif;
  font-weight: 600;
}

input:focus {outline:none!important;}

.form {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

button {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 546px;
  font-size: 20px;
  font-family: "Roboto Flex", sans-serif;
  font-weight: 600;
  background-color: #04AA6D;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}

.footer {
  justify-content: center;
  align-items: flex-start;
  display: flex;
  margin-top: 30px;
}

.chef {
  width: 200px;
  position: fixed;
  bottom: -70px;
  left: 20px;
}

.nfts {
  display: flex;
}

.nft_img {
  border: 3px solid black;
}

@media (max-width: 1024px) {
  .hero {
    padding: 20px;
  }

  .nav_buttons {
    display: none;
  }

  .logo_desktop {
    margin-left: 20px;
  }

  .info {
    font-size: 20px;
  }

  input {
    width: 300px;
  }

  button {
    width: 346px;
  }

  .footer {
    margin-bottom: 60px;
    font-size: 12px;
    padding: 20px;
  }

  .chef {
    display: none;
  }
}
</style>