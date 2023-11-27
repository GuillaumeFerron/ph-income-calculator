<template>
  <div class="card mb-0">
    <div class="card-body px-5">
      <div class="row justify-content-between align-items-center">
        <h2>Income Calculator</h2>
        <small class="clickable" @click="data.type = otherType">Switch to {{ otherType }} calculator</small>
      </div>
      <div v-if="data.type === 'coe'">
        <div class="row">
          <div class="col-12 col-xl-6 pr-xl-4">
            <h3 class="mt-4">INCOME</h3>
            <div class="row px-0">
              <h5 class="col-4">Gross Income</h5>
              <input v-model="data.coeGross" type="number" class="form-control col-4" aria-describedby="gross-income">
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ data.coeGross | currencyFormat }}</h5>
            </div>
          </div>
          <div class="divider my-3 col-12"></div>
        </div>
      </div>
      <div v-else>
        <ol class="font-italic">
          <li><small>Ignore the FF</small></li>
          <li><small>Always ignore the 13th pay</small></li>
          <li><small>Ignore OTs and Holidays. It will only unnecessarily increase the income portion. These cannot be used
              to measure gross income</small></li>
        </ol>
        <div class="row px-0 mt-4">
          <h3 class="col-4 col-xl-2 mt-0">PAYSLIP TYPE</h3>
          <div class="row mx-0 col-8 pl-0 align-items-center justify-content-start">
            <div v-for="(payslipType, key) in config.PAYSLIP_TYPES" :key="`type-${payslipType.label}`" class="clickable mr-3"
              @click="data.payslip = key">
              <input :id="`type-${payslipType.label}`" type="radio" :name="payslipType.label"
                :checked="data.payslip === key">
              <label :for="payslipType.label" class="ml-2">{{ payslipType.label }}</label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="income-section col-12 col-xl-6 pr-xl-4">
            <h3 class="mt-4">INCOME</h3>
            <div class="row px-0">
              <h5 class="col-4">Salary</h5>
              <input v-model="data.salary" type="number" class="form-control col-3" aria-describedby="salary">
              <h5 class="col-2">x {{ multiplier }}</h5>
              <h5 class="text-secondary col-3 pr-0 text-right mb-0">{{ subtotalSalary | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">Night Shift</h5>
              <input v-model="data.nightShift" type="number" class="form-control col-3" aria-describedby="night-shift">
              <h5 class="col-2">x {{ multiplier }}</h5>
              <h5 class="text-secondary col-3 pr-0 text-right mb-0">{{ subtotalNightShift | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">Tardiness <small>(monthly)</small></h5>
              <input v-model="data.tardiness" type="number" class="form-control col-3" aria-describedby="tardiness">
              <h5 class="col-2">x {{ 1 }}</h5>
              <h5 class="text-secondary col-3 pr-0 text-right mb-0">{{ subtotalTardiness | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">Deminimis <small>(monthly)</small></h5>
              <input v-model="data.deminimis" type="number" class="form-control col-3" aria-describedby="deminimis">
              <h5 class="col-2">x {{ 1 }}</h5>
              <h5 class="text-secondary col-3 pr-0 text-right mb-0">{{ subtotalDeminimis | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">Allowances <small>(monthly)</small></h5>
              <div class="col-3 px-0">
                <input v-for="(allowance, key) in computedAllowances" :key="`allowance-${key}`"
                  v-model="data.allowances[key]" type="number" class="form-control mt-1"
                  :aria-describedby="`allowance-${allowance}`">
              </div>
              <h5 class="col-2">x {{ 1 }}</h5>
              <h5 class="text-secondary col-3 pr-0 text-right mb-0">{{ subtotalAllowances | currencyFormat }}</h5>
            </div>
            <div class="row flex-column align-items-end justify-content-end px-0">
              <h4>Total</h4>
              <h5 class="text-secondary pr-0 text-right mb-0 font-bold">{{ totalIncome | currencyFormat }}</h5>
            </div>
            <div class="divider mt-3"></div>
            <h3 class="mt-4">TAXES</h3>
            <div class="row px-0 mt-1">
              <h5 class="col-4">Taxable Income <small>(monthly)</small></h5>
              <input type="number" class="form-control col-3" aria-describedby="taxable-income"
                :value="subtotalTaxableIncome" disabled>
              <h5 class="col-2">x {{ 1 }}</h5>
              <h5 class="text-secondary col-3 pr-0 text-right mb-0">{{ subtotalTaxableIncome | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">Income Tax <small>(monthly)</small></h5>
              <input type="number" class="form-control col-3" aria-describedby="taxable-income"
                :value="subtotalMonthlyTax" disabled>
              <h5 class="col-2">x {{ 1 }}</h5>
              <h5 class="text-secondary col-3 pr-0 text-right mb-0">{{ subtotalMonthlyTax | currencyFormat }}</h5>
            </div>
            <div class="divider mt-3 d-xl-none"></div>
          </div>
          <div class="col-12 col-xl-6">
            <h3 class="mt-4">CONTRIBUTIONS</h3>
            <div class="row px-0">
              <h5 class="col-4">SSS <small>(monthly)</small></h5>
              <input type="number" class="form-control col-3" aria-describedby="sss" :value="sss" disabled>
              <h5 class="col-2">x {{ 1 }}</h5>
              <h5 class="text-secondary col-3 pr-0 text-right mb-0">{{ subtotalSss | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">GSIS <small>(monthly)</small></h5>
              <input v-model="data.gsis" type="number" class="form-control col-3" aria-describedby="gsis">
              <h5 class="col-2">x {{ 1 }}</h5>
              <h5 class="text-secondary col-3 pr-0 text-right mb-0">{{ subtotalGsis | currencyFormat }}</h5>
            </div>
            <!-- <div class="row px-0 mt-1">
              <h5 class="col-4">Life Insurance <small>(monthly)</small></h5>
              <input v-model="data.lifeInsurance" type="number" class="form-control col-3"
                aria-describedby="life-insurance">
                <h5 class="col-2">x {{ 1 }}</h5>
              <h5 class="text-secondary col-3 pr-0 text-right mb-0">{{ subtotalLifeInsurance | currencyFormat }}</h5>
            </div> -->
            <div class="row px-0 mt-1">
              <h5 class="col-4">PAGIBIG/HDMF <small>(monthly)</small></h5>
              <input type="number" class="form-control col-3" aria-describedby="pagibig" :value="pagibig" disabled>
              <h5 class="col-2">x {{ 1 }}</h5>
              <h5 class="text-secondary col-3 pr-0 text-right mb-0">{{ subtotalPagibig | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">PhilHealth</h5>
              <input type="number" class="form-control col-3" aria-describedby="philhealth" :value="philhealth" disabled>
              <h5 class="col-2">x {{ multiplier }}</h5>
              <h5 class="text-secondary col-3 pr-0 text-right mb-0">{{ subtotalPhilhealth | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">Other Deductions <small>(monthly)</small></h5>
              <div class="col-3 px-0">
                <input v-for="(otherDeduction, key) in computedOtherDeductions" :key="`other-deduction-${key}`"
                  v-model="data.otherDeductions[key]" type="number" class="form-control mt-1"
                  :aria-describedby="`other-deduction-${otherDeduction}`">
              </div>
              <h5 class="col-2">x {{ 1 }}</h5>
              <h5 class="text-secondary col-3 pr-0 text-right mb-0">{{ subtotalOtherDeductions | currencyFormat }}</h5>
            </div>
            <div class="row flex-column align-items-end justify-content-end px-0">
              <h4>Total</h4>
              <h5 class="text-secondary pr-0 text-right mb-0 font-bold">{{ totalContributions | currencyFormat }}</h5>
            </div>
            <div class="divider mt-3"></div>
            <h3 class="mt-4">LOANS</h3>
            <div class="row px-0 mt-1">
              <h5 class="col-4">SSS Loan <small>(monthly)</small></h5>
              <input v-model="data.sssLoan" type="number" class="form-control col-3" aria-describedby="sss-loan">
              <h5 class="col-2">x {{ 1 }}</h5>
              <h5 class="text-secondary col-3 pr-0 text-right mb-0">{{ subtotalSssLoan | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">HDMF Loan <small>(monthly)</small></h5>
              <input v-model="data.hdmfLoan" type="number" class="form-control col-3" aria-describedby="hdmf-loan">
              <h5 class="col-2">x {{ 1 }}</h5>
              <h5 class="text-secondary col-3 pr-0 text-right mb-0">{{ subtotalHdmfLoan | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">HMO Loan <small>(monthly)</small></h5>
              <input v-model="data.hmoLoan" type="number" class="form-control col-3" aria-describedby="hmo-loan">
              <h5 class="col-2">x {{ 1 }}</h5>
              <h5 class="text-secondary col-3 pr-0 text-right mb-0">{{ subtotalHmoLoan | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">Other Loans <small>(monthly)</small></h5>
              <div class="col-3 px-0">
                <input v-for="(otherLoan, key) in computedOtherLoans" :key="`other-${key}`" v-model="data.otherLoans[key]"
                  type="number" class="form-control mt-1" :aria-describedby="`other-loan-${otherLoan}`">
              </div>
              <h5 class="col-2">x {{ 1 }}</h5>
              <h5 class="text-secondary col-3 pr-0 text-right mb-0">{{ subtotalOtherLoans | currencyFormat }}</h5>
            </div>
            <div class="row flex-column align-items-end justify-content-end px-0">
              <h4>Total</h4>
              <h5 class="text-secondary pr-0 text-right mb-0 font-bold">{{ totalLoans | currencyFormat }}</h5>
            </div>
            <div class="divider my-3 d-xl-none"></div>
          </div>
        </div>
      </div>
      <div>
        <div class="row">
          <div class="col-2 border border-primary rounded mx-auto">
            <h3>Gross Income</h3>
            <transition name="fade" mode="out-in">
              <h4 class="clickable" v-if="!copied.gross" @click="copyGross">{{ grossIncome | currencyFormat }}</h4>
              <h5 v-else>Copied</h5>
            </transition>
          </div>
          <div class="col-2 border border-primary rounded mx-auto">
            <h3>Net Income</h3>
            <transition name="fade" mode="out-in">
              <h4 class="clickable" v-if="!copied.net" @click="copyNet">{{ netIncome | currencyFormat }}</h4>
              <h5 v-else>Copied</h5>
            </transition>
          </div>
          <div class="col-2 ml-auto">
            <div class="h-50" />
            <tp-button class="p-0" @click="close">Close</tp-button>
          </div>
          <div class="col-2">
            <div class="h-50" />
            <tp-button class="p-0" @click="clear">Clear</tp-button>
          </div>
          <div class="col-2 flex flex-column justify-content-between">
            <div class="h-50" />
            <tp-button class="p-0" color-theme="secondary" @click="fill">Fill</tp-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TpButton from './common/TpButton.vue'

const FORCE_CACHE = false
const PAYSLIP_TYPES = {
  'weekly': {
    label: 'Weekly',
    multiplier: 4
  },
  'biweekly': {
    label: 'Bi-Weekly',
    multiplier: 2
  },
  'monthly': {
    label: 'Monthly',
    multiplier: 1
  }
}
const DEFAULT_PAYSLIP = 'biweekly'
const CACHE_KEY = 'TENDOPAY_INCOME_CALCULATOR'
const COE_COEFFICIENT = 0.8
const TYPES = ['payslip', 'coe']
const DEFAULT_TYPE = TYPES[0]
const PAGIBIG_BRACKETS = [
  { min: 0, pagibig: 0.01 },
  { min: 1501, pagibig: 0.02 }
]
const TAX_BRACKETS = [
  { min: 0, tax: 0 },
  { min: 20834, tax: 0.2 },
  { min: 33333, tax: 0.25 },
  { min: 66667, tax: 0.3 },
  { min: 166667, tax: 0.32 },
  { min: 666667, tax: 0.35 }
]
const SSS_BRACKETS = [
  { min: 0, sss: 180 },
  { min: 4250, sss: 202.5 },
  { min: 4750, sss: 225 },
  { min: 5250, sss: 247.5 },
  { min: 5750, sss: 270 },
  { min: 6250, sss: 292.5 },
  { min: 6750, sss: 315 },
  { min: 7250, sss: 337.5 },
  { min: 7750, sss: 360 },
  { min: 8250, sss: 382.5 },
  { min: 8750, sss: 405 },
  { min: 9250, sss: 427.5 },
  { min: 9750, sss: 450 },
  { min: 10250, sss: 472.5 },
  { min: 10750, sss: 495 },
  { min: 11250, sss: 517.5 },
  { min: 11750, sss: 540 },
  { min: 12250, sss: 562.5 },
  { min: 12750, sss: 585 },
  { min: 13250, sss: 607.5 },
  { min: 13750, sss: 630 },
  { min: 14250, sss: 652.5 },
  { min: 14750, sss: 675 },
  { min: 15250, sss: 697.5 },
  { min: 15750, sss: 720 },
  { min: 16250, sss: 742.5 },
  { min: 16750, sss: 765 },
  { min: 17250, sss: 787.5 },
  { min: 17750, sss: 810 },
  { min: 18250, sss: 832.5 },
  { min: 18750, sss: 855 },
  { min: 19250, sss: 877.5 },
  { min: 19750, sss: 900 },
  { min: 20250, sss: 922.5 },
  { min: 20750, sss: 945 },
  { min: 21250, sss: 967.5 },
  { min: 21750, sss: 990 },
  { min: 22250, sss: 1012.5 },
  { min: 22750, sss: 1035 },
  { min: 23250, sss: 1057.5 },
  { min: 23750, sss: 1080 },
  { min: 24250, sss: 1102.5 },
  { min: 24750, sss: 1125 },
  { min: 25250, sss: 1147.5 },
  { min: 25750, sss: 1170 },
  { min: 26250, sss: 1192.5 },
  { min: 26750, sss: 1215 },
  { min: 27250, sss: 1237.5 },
  { min: 27750, sss: 1260 },
  { min: 28250, sss: 1282.5 },
  { min: 28750, sss: 1305 },
  { min: 29250, sss: 1327.5 },
  { min: 29750, sss: 1350 }
]

export default {
  name: 'IncomeCalculator',
  components: { TpButton },
  props: {
    incomeType: {
      type: String,
      required: false,
      default: DEFAULT_TYPE
    },
    userId: {
      type: Number,
      required: false,
      default: null
    }
  },
  data() {
    return {
      // Config
      config: {
        PAYSLIP_TYPES
      },
      // Reactive
      cacheProcessed: false,
      copied: {
        gross: false,
        net: false
      },
      data: {
        payslip: DEFAULT_PAYSLIP,
        salary: null,
        nightShift: null,
        tardiness: null,
        deminimis: null,
        allowances: [],
        sss: null,
        gsis: null,
        lifeInsurance: null,
        sssLoan: null,
        hdmfLoan: null,
        hmoLoan: null,
        otherLoans: [],
        otherDeductions: [],
        coeGross: null,
        type: DEFAULT_TYPE
      }
    }
  },
  computed: {
    otherType() {
      return TYPES[Math.max((TYPES.indexOf(this.data.type) || 0) + 1, 0) % TYPES.length]
    },
    multiplier() {
      return this.config.PAYSLIP_TYPES[this.computedPayslip] ? this.config.PAYSLIP_TYPES[this.computedPayslip].multiplier : 1
    },
    computedPayslip() {
      return this.data.payslip || DEFAULT_PAYSLIP
    },
    computedAllowances() {
      return [...this.data.allowances.filter(_ => _ != null && _ != 0), null]
    },
    computedOtherLoans() {
      return [...this.data.otherLoans.filter(_ => _ != null && _ != 0), null]
    },
    computedOtherDeductions() {
      return [...this.data.otherDeductions.filter(_ => _ != null && _ != 0), null]
    },
    pagibig() {
      return Math.min(PAGIBIG_BRACKETS.sort((a, b) => b.min - a.min).find(_ => this.subtotalSalary >= _.min).pagibig * this.subtotalSalary, 100).toFixed(2)
    },
    philhealth() {
      return Math.max(Math.min(this.data.salary * 0.045 / 2, 1600 / this.multiplier), 225 / this.multiplier).toFixed(2)
    },
    sss() {
      return SSS_BRACKETS.sort((a, b) => b.min - a.min).find(_ => this.subtotalSalary >= _.min).sss.toFixed(2)
    },
    subtotalSalary() {
      return (this.data.salary || 0) * this.multiplier
    },
    subtotalNightShift() {
      return (this.data.nightShift || 0) * this.multiplier
    },
    subtotalTardiness() {
      return (this.data.tardiness || 0) * 1
    },
    subtotalDeminimis() {
      return (this.data.deminimis || 0) * 1
    },
    subtotalAllowances() {
      return this.data.allowances.reduce((acc, _) => acc + parseInt(_ || 0), 0) * 1
    },
    subtotalTaxableIncome() {
      return Math.max(this.totalIncome - this.totalDeductions, 0).toFixed(2)
    },
    subtotalMonthlyTax() {
      return TAX_BRACKETS.sort((a, b) => b.min - a.min).reduce((acc, _) => ({ remainder: Math.min(_.min, this.subtotalTaxableIncome), tax: acc.tax + Math.max(acc.remainder - _.min, 0) * _.tax }), { remainder: this.subtotalTaxableIncome, tax: 0 }).tax.toFixed(2)
    },
    subtotalSss() {
      return this.sss * 1
    },
    subtotalGsis() {
      return this.data.gsis * 1
    },
    subtotalPhilhealth() {
      return this.philhealth * this.multiplier
    },
    subtotalLifeInsurance() {
      return this.data.lifeInsurance * 1
    },
    subtotalPagibig() {
      return this.pagibig * 1
    },
    subtotalSssLoan() {
      return this.data.sssLoan * 1
    },
    subtotalHdmfLoan() {
      return this.data.hdmfLoan * 1
    },
    subtotalHmoLoan() {
      return this.data.hmoLoan * 1
    },
    subtotalOtherLoans() {
      return this.data.otherLoans.reduce((acc, _) => acc + parseInt(_ || 0), 0) * 1
    },
    subtotalOtherDeductions() {
      return this.data.otherDeductions.reduce((acc, _) => acc + parseInt(_ || 0), 0) * 1
    },
    totalContributions () {
      return Math.max(this.subtotalSss + this.subtotalGsis + this.subtotalPagibig + this.subtotalPhilhealth + this.subtotalOtherDeductions, 0)
    },
    totalLoans() {
      return Math.max(this.subtotalSssLoan + this.subtotalHdmfLoan + this.subtotalHmoLoan + this.subtotalOtherLoans, 0)
    },
    totalIncome() {
      return Math.max(this.subtotalSalary + this.subtotalNightShift + this.subtotalAllowances - this.subtotalTardiness, 0)
    },
    totalDeductions() {
      return this.totalContributions + this.totalLoans
    },
    grossIncome() {
      if (this.data.type == 'coe') {
        return Math.max(this.data.coeGross)
      }
      return this.mround(Math.max(this.totalIncome + this.subtotalDeminimis, 0), 500)
    },
    netIncome() {
      if (this.data.type == 'coe') {
        return Math.max(this.data.coeGross * COE_COEFFICIENT)
      }
      return this.mround(Math.max(this.totalIncome + this.subtotalDeminimis - this.totalDeductions - this.subtotalMonthlyTax, 0))
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        if (this.cacheProcessed) {
          this.storeCache()
        }
      }
    }
  },
  mounted() {
    this.data.type = this.incomeType
    this.restoreCache()
  },
  methods: {
    fill() {
      const { grossIncome, netIncome } = this
      this.$emit('fill', { grossIncome, netIncome })
      this.$emit('close')
    },
    storeCache() {
      const obj = {
        user: this.getUser(),
        data: this.data
      }
      localStorage.setItem(CACHE_KEY, Buffer.from(JSON.stringify(obj)).toString('base64'))
    },
    restoreCache() {
      const res = localStorage.getItem(CACHE_KEY)
      if (res) {
        let clear = {}
        try {
          clear = JSON.parse(Buffer.from(res, 'base64').toString('ascii'))
        } catch (err) {
          clear = {}
        }
        const user = clear.user
        if (user != this.getUser() && !FORCE_CACHE) {
          this.clear()
          this.data.type = this.incomeType != '' ? this.incomeType : DEFAULT_TYPE
          console.log(`* INCOME CALCULATOR: Invalidated cache (cached user ${user}; processing user ${this.getUser()})`)
        } else {
          const data = clear.data
          Object.keys(data || {}).forEach(_ => {
            if (data[_] != null) {
              this.data[_] = data[_]
            }
          })
          console.log(`* INCOME CALCULATOR: Restored cache for user ${this.getUser()}`)
        }
      }
      this.cacheProcessed = true
    },
    clear() {
      Object.keys(this.data || {}).forEach(_ => {
        if (typeof this.data[_] === 'object') {
          this.data[_] = []
        } else {
          this.data[_] = null
        }
      })
      this.data.payslip = DEFAULT_PAYSLIP
      localStorage.removeItem(CACHE_KEY)
    },
    close() {
      this.$emit('close')
    },
    getUser() {
      if (this.userId) {
        return this.userId
      }
      const splits = window.location.pathname.split('/')
      const user = splits[splits.length - 1]
      return parseInt(user)
    },
    copyGross () {
      this.copyTextToClipboard(this.grossIncome)
      this.copied.gross = true
      setTimeout(() => {
        this.copied.gross = false
      }, 1000)
    },
    copyNet() {
      this.copyTextToClipboard(this.netIncome)
      this.copied.net = true
      setTimeout(() => {
        this.copied.net = false
      }, 1000)
    },
    copyTextToClipboard (text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;

      // Prevents scrolling to the bottom of the page in Microsoft Edge.
      textarea.style.top = "0";
      textarea.style.left = "0";
      textarea.style.position = "fixed";

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
      } catch (err) {
        console.error('Unable to copy', err);
      }

      document.body.removeChild(textarea);
    },
    mround(number, roundto) {
      return roundto * Math.round(number / roundto)
    }
  }
}
</script>

<style lang="scss" scoped>
.income-section {
  @media screen and (min-width: 1200px) {
    border-right: 1px solid #dee2e6 !important
  }
}

.divider {
  border-bottom: 1px solid #dee2e6 !important
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
