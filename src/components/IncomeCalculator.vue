<template>
  <div class="card mb-0">
    <div class="card-body">
      <div class="row justify-content-between align-items-center">
        <h2>Income Calculator</h2>
        <small class="clickable" @click="data.type = otherType">Switch to {{ otherType }} calculator</small>
      </div>
      <div v-if="data.type === 'coe'">
        <div class="row">
          <div class="col-12 col-xl-6 pr-xl-4">
            <h3>INCOME</h3>
            <div class="row px-0">
              <h5 class="col-4">Gross Income</h5>
              <input v-model="data.coeGross" type="number" class="form-control col-4" aria-describedby="gross-income">
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ data.coeGross | currencyFormat }}</h5>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <ol>
          <li><small>Ignore the FF</small></li>
          <li><small>Always ignore the 13th pay</small></li>
          <li><small>Ignore OTs and Holidays. It will only unnecessarily increase the income portion. These cannot be used
              to measure gross income</small></li>
        </ol>
        <div class="row px-0">
          <h5 class="col-4 col-xl-2 mt-0">Payslip Type</h5>
          <div class="col-6 pl-0">
            <div v-for="(payslipType, key) in config.PAYSLIP_TYPES" :key="`type-${payslipType.label}`" class="clickable"
              @click="data.payslip = key">
              <input :id="`type-${payslipType.label}`" type="radio" :name="payslipType.label"
                :checked="data.payslip === key">
              <label :for="payslipType.label">{{ payslipType.label }}</label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="income-section col-12 col-xl-6 pr-xl-4">
            <h3>INCOME</h3>
            <div class="row justify-content-end px-0">
              <h4 class="my-0">Subtotal</h4>
            </div>
            <div class="row px-0">
              <h5 class="col-4">Salary</h5>
              <input v-model="data.salary" type="number" class="form-control col-4" aria-describedby="salary">
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ subtotalSalary | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">Night Shift</h5>
              <input v-model="data.nightShift" type="number" class="form-control col-4" aria-describedby="night-shift">
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ subtotalNightShift | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">Tardiness</h5>
              <input v-model="data.tardiness" type="number" class="form-control col-4" aria-describedby="tardiness">
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ subtotalTardiness | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">Deminimis</h5>
              <input v-model="data.deminimis" type="number" class="form-control col-4" aria-describedby="deminimis">
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ subtotalDeminimis | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">Allowances</h5>
              <div class="col-4 px-0">
                <input v-for="(allowance, key) in computedAllowances" :key="`allowance-${key}`"
                  v-model="data.allowances[key]" type="number" class="form-control mt-1"
                  :aria-describedby="`allowance-${allowance}`">
              </div>
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ subtotalAllowances | currencyFormat }}</h5>
            </div>
            <div class="row justify-content-end px-0">
              <div>
                <h4>Total</h4>
                <h5 class="text-secondary pr-0 text-right mb-0 font-bold">{{ totalIncome | currencyFormat }}</h5>
              </div>
            </div>
            <h3>TAXES</h3>
            <div class="row px-0 mt-1">
              <h5 class="col-4">Taxable Income</h5>
              <input type="number" class="form-control col-4" aria-describedby="taxable-income"
                :value="subtotalTaxableIncome" disabled>
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ subtotalTaxableIncome | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">Monthly Income Tax</h5>
              <input type="number" class="form-control col-4" aria-describedby="taxable-income"
                :value="subtotalMonthlyTax" disabled>
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ subtotalMonthlyTax | currencyFormat }}</h5>
            </div>
          </div>
          <div class="col-12 col-xl-6">
            <h3>DEDUCTIONS</h3>
            <div class="row justify-content-between pr-0 ml-0">
              <h4 class="my-0">Contributions</h4>
              <h4 class="my-0">Subtotal</h4>
            </div>
            <div class="row px-0">
              <h5 class="col-4">SSS</h5>
              <input type="number" class="form-control col-4" aria-describedby="sss" :value="sss" disabled>
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ subtotalSss | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">GSIS</h5>
              <input v-model="data.gsis" type="number" class="form-control col-4" aria-describedby="gsis">
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ subtotalGsis | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">Life Insurance</h5>
              <input v-model="data.lifeInsurance" type="number" class="form-control col-4"
                aria-describedby="life-insurance">
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ subtotalLifeInsurance | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">PAGIBIG <small>(HDMF)</small></h5>
              <input type="number" class="form-control col-4" aria-describedby="pagibig" :value="pagibig" disabled>
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ subtotalPagibig | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">PhilHealth</h5>
              <input type="number" class="form-control col-4" aria-describedby="philhealth" :value="philhealth" disabled>
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ subtotalPagibig | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">Other Deductions</h5>
              <div class="col-4 px-0">
                <input v-for="(otherDeduction, key) in computedOtherDeductions" :key="`other-deduction-${key}`"
                  v-model="data.otherDeductions[key]" type="number" class="form-control mt-1"
                  :aria-describedby="`other-deduction-${otherDeduction}`">
              </div>
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ subtotalOtherDeductions | currencyFormat }}</h5>
            </div>
            <div class="row justify-content-between ml-0 mt-1">
              <h4 class="my-0">Loans</h4>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">SSS Loan</h5>
              <input v-model="data.sssLoan" type="number" class="form-control col-4" aria-describedby="sss-loan">
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ subtotalSssLoan | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">HDMF Loan</h5>
              <input v-model="data.hdmfLoan" type="number" class="form-control col-4" aria-describedby="hdmf-loan">
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ subtotalHdmfLoan | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">HMO Loan</h5>
              <input v-model="data.hmoLoan" type="number" class="form-control col-4" aria-describedby="hmo-loan">
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ subtotalHmoLoan | currencyFormat }}</h5>
            </div>
            <div class="row px-0 mt-1">
              <h5 class="col-4">Other Loans</h5>
              <div class="col-4 px-0">
                <input v-for="(otherLoan, key) in computedOtherLoans" :key="`other-${key}`" v-model="data.otherLoans[key]"
                  type="number" class="form-control mt-1" :aria-describedby="`other-loan-${otherLoan}`">
              </div>
              <h5 class="text-secondary col-4 pr-0 text-right mb-0">{{ subtotalOtherLoans | currencyFormat }}</h5>
            </div>
            <div class="row justify-content-end px-0">
              <div>
                <h4>Total</h4>
                <h5 class="text-secondary pr-0 text-right mb-0 font-bold">{{ totalDeductions | currencyFormat }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="row">
          <div class="col-3">
            <h3>Gross Income</h3>
            <h4>{{ grossIncome | currencyFormat }}</h4>
          </div>
          <div class="col-3">
            <h3>Net Income</h3>
            <h4>{{ netIncome | currencyFormat }}</h4>
          </div>
          <div class="col-2">
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

const PAYSLIP_TYPES = {
  'weekly': {
    label: 'Weekly',
    multiplier: 4,
    pagibig: 25
  },
  'biweekly': {
    label: 'Bi-Weekly',
    multiplier: 2,
    pagibig: 50
  },
  'monthly': {
    label: 'Monthly',
    multiplier: 1,
    pagibig: 100
  }
}
const DEFAULT_PAYSLIP = 'biweekly'
const CACHE_KEY = 'TENDOPAY_INCOME_CALCULATOR'
const COE_COEFFICIENT = 0.8
const TYPES = ['payslip', 'coe']
const DEFAULT_TYPE = TYPES[0]
const TAX_BRACKETS = [
  { min: 666667, tax: 0.35 },
  { min: 166667, tax: 0.3 },
  { min: 66667, tax: 0.25 },
  { min: 33333, tax: 0.2 },
  { min: 20834, tax: 0.15 },
  { min: 0, tax: 0 }
]
const SSS_BRACKETS = [
  { min: 0, sss: 180 },
  { min: 4500, sss: 202.5 },
  { min: 5000, sss: 225 },
  { min: 5500, sss: 247.5 },
  { min: 6000, sss: 270 },
  { min: 6500, sss: 292.5 },
  { min: 7000, sss: 315 },
  { min: 7500, sss: 337.5 },
  { min: 8000, sss: 360 },
  { min: 8500, sss: 382.5 },
  { min: 9000, sss: 405 },
  { min: 9500, sss: 427.5 },
  { min: 10000, sss: 450 },
  { min: 10500, sss: 472.5 },
  { min: 11000, sss: 495 },
  { min: 11500, sss: 517.5 },
  { min: 12000, sss: 540 },
  { min: 12500, sss: 562.5 },
  { min: 13000, sss: 585 },
  { min: 13500, sss: 607.5 },
  { min: 14000, sss: 630 },
  { min: 14500, sss: 652.5 },
  { min: 15000, sss: 675 },
  { min: 15500, sss: 697.5 },
  { min: 16000, sss: 720 },
  { min: 16500, sss: 742.5 },
  { min: 17000, sss: 765 },
  { min: 17500, sss: 787.5 },
  { min: 18000, sss: 810 },
  { min: 18500, sss: 832.5 },
  { min: 19000, sss: 855 },
  { min: 19500, sss: 877.5 },
  { min: 20000, sss: 900 }
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
      return this.config.PAYSLIP_TYPES[this.computedPayslip] ? this.config.PAYSLIP_TYPES[this.computedPayslip].pagibig : 0
    },
    philhealth() {
      return Math.max(Math.min(this.data.salary * 0.045 / 2), 225)
    },
    sss() {
      return SSS_BRACKETS.sort((a, b) => a.min - b.min).find(_ => this.subtotalSalary >= _.min).sss
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
      return this.totalIncome - this.totalDeductions
    },
    subtotalMonthlyTax() {
      return TAX_BRACKETS.sort((a, b) => a.min - b.min).reduce((acc, _) => ({ remainder: _.min, tax: acc.tax + (acc.remainder - _.min) * _.tax }), { remainder: this.subtotalTaxableIncome, tax: 0 })
    },
    subtotalSss() {
      return this.sss * 1
    },
    subtotalGsis() {
      return this.data.gsis * 1
    },
    subtotalPhilhealth() {
      return this.philhealth
    },
    subtotalLifeInsurance() {
      return this.data.lifeInsurance * 1
    },
    subtotalPagibig() {
      return this.pagibig * this.multiplier
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
    totalIncome() {
      return Math.max(this.subtotalSalary + this.subtotalNightShift + this.subtotalAllowances + this.subtotalTardiness, 0)
    },
    totalDeductions() {
      return Math.max(this.subtotalSss + this.subtotalGsis + this.subtotalLifeInsurance + this.subtotalPagibig + this.subtotalPhilhealth + this.subtotalSssLoan + this.subtotalHdmfLoan + this.subtotalHmoLoan + this.subtotalOtherLoans + this.subtotalOtherDeductions, 0)
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
      return this.mround(Math.max(this.totalIncome + this.subtotalDeminimis - this.totalDeductions - this.subtotalMonthlyTax, 0), 500)
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
        if (user != this.getUser()) {
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
</style>
