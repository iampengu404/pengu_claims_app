<template>
  <main>
    <div class="chef"><img src="@/assets/chef.png" /></div>
    <div class="hero">
      <div class="topnav"><div class="logo_desktop"><a href="https://www.pengufoods.xyz"><img src="https://assets-global.website-files.com/65ce4b6e0ff5b1cccd696736/65ce986adaf1eb97e936d747_logo_header.svg" loading="lazy" width="Auto" height="50" alt=""></a></div><div class="nav_buttons"><a href="https://opensea.io/collection/pengu-foods" target="_blank" class="topnav_links w-inline-block"><img src="https://assets-global.website-files.com/65ce4b6e0ff5b1cccd696736/65cfcfcbd533ed5832267bca_opensea.svg" loading="lazy" width="40" height="Auto" alt=""></a></div></div>
      <div class="div_hero">
        <div class="heading_shadow_hero">Claim PENGU FOODS!</div>

        <div><img src="https://assets-global.website-files.com/65ce4b6e0ff5b1cccd696736/65cf8efed38587746f48c037_orange.png" width="186" class="float"></div>

        <div class="info">Simply enter your wallet address and if you own a {{ currentCollection }} with specic traits, you will receive $PENGU at the time of the airdrop.</div>
        <div class="traits">* Eligable Head traits: Wizard Hat, Bowl Cut, Rice Hat, None, Pirate Hat, Backwards Hat Blue, Viking Helmet, Biker Helmet</div>
        <div class="form">
          <div><input type="text" placeholder="Enter wallet address (0x...)" v-model="ownerAddress"></div>
          <div v-if="searching"><button :disabled="true">Searching...</button></div>
          <div v-else><button @click="getOwnedTokens()">GO</button></div>
        </div>
        <div class="message" v-if="message">{{ message }}</div>
        <div v-if="nfts.length">
          <div class="nfts" v-for="nft in nfts">
            <div>
              <img class="nft_img" :src="nft.img_url" width="100"/>
            </div>
          </div>
        </div>

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

export default {
  data() {
    return {
      ownerAddress: null,
      nfts: [],
      eligableTraits: [
        'Wizard Hat',
        'Bowl Cut',
        'Rice Hat',
        'None',
        'Pirate Hat',
        'Backwards Hat Blue',
        'Viking Helmet',
        'Biker Helmet',
      ],
      currentCollection: import.meta.env.VITE_COLLECTION_NAME,
      message: null,
      searching: false,
    }
  },
  methods: {
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async save() {
      // Save to Sheets
      const res = await axios.get(`/api/sheets?address=${this.ownerAddress}`)
      console.log(res.data)
      this.message = "Contgrats! You'll be receiving $PENGU airdrops soon. 🐟"
    },
    traitChecker(traits) {
      const that = this
      var found = false

      _.forEach(traits, function (element) {
        if (element.trait_type == 'Head' && that.eligableTraits.includes(element.value)){
          found = true
          return false
        }
      })

      if (found) {
        return true
      }

      return false
    },
    async fetchOsData(tokenId) {
      const url = `https://api.opensea.io/api/v2/chain/ethereum/contract/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/nfts/${tokenId}`
      const res = await axios.get(url, { headers: { 'x-api-key': import.meta.env.VITE_OS_KEY } })
      return res.data.nft
    },
    async getOwnedTokens() {
      this.nfts = []
      this.notFound = false
      this.searching = true
      this.message = null

      const url = `https://api.opensea.io/api/v2/chain/ethereum/account/${this.ownerAddress}/nfts?collection=${import.meta.env.VITE_COLLECTION_SLUG}`
      const res = await axios.get(url, { headers: { 'x-api-key': import.meta.env.VITE_OS_KEY } })
      const nfts = res.data.nfts
      
      for (let i = 0; i < nfts.length; i++) {
        const tokenId = nfts[i].identifier

        await this.sleep(3000);
        var osData = await this.fetchOsData(tokenId)

        var traits = osData.traits
        var image_url = osData.image_url
        var name = osData.name

        var traitExists = this.traitChecker(traits)

        if (traitExists) {

          this.nfts.push(
            {
              id: tokenId,
              traits: traits,
              img_url: image_url,
              name: name
            }
          )
        }
      }

      if (this.nfts.length < 1) {
        this.message = `Sorry, your ${this.currentCollection }s don't have the required traits 😔`
      } else {
        this.save()
      }

      this.searching = false
    }
  },
  mounted() {
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