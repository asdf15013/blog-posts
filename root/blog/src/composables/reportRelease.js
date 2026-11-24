// 报告发布时刻与已读状态。
// 发布规则（用户指定）：
//   月报：每月一号 22:00 解锁「上一个月」的报告
//   年报：每年 12 月 31 日 22:00 解锁「当年」的年度报告（岁末放送）
// 纯函数按东八区计算，便于单测。

function nowCN() {
  return new Date(Date.now() + 8 * 3600_000)
}

// 距发布还有多少毫秒（<=0 表示已发布）
export function msUntilMonthlyRelease(cnNow = nowCN()) {
  // 本月一号 22:00（东八区）= 上月报的发布时刻
  const y = cnNow.getUTCFullYear()
  const m = cnNow.getUTCMonth()
  const release = new Date(Date.UTC(y, m, 1, 14, 0, 0)) // UTC 14:00 = 东八区 22:00
  return release.getTime() - cnNow.getTime()
}

export function msUntilAnnualRelease(cnNow = nowCN()) {
  const y = cnNow.getUTCFullYear()
  const release = new Date(Date.UTC(y, 11, 31, 14, 0, 0)) // 12-31 22:00 东八区
  return release.getTime() - cnNow.getTime()
}

// 最近一期已发布的报告：年报优先于月报
export function latestReleased(cnNow = nowCN()) {
  const annualOut = msUntilAnnualRelease(cnNow) <= 0
  const monthlyOut = msUntilMonthlyRelease(cnNow) <= 0

  // 年报：发布中→当年(offset 0)；未发布→去年(offset 1，去年 12-31 22 点已放送)
  const annual = annualOut
    ? { type: 'year', offset: 0, key: `year-${cnNow.getUTCFullYear()}` }
    : { type: 'year', offset: 1, key: `year-${cnNow.getUTCFullYear() - 1}` }

  // 月报：本月一号已过 22 点→上月(offset 1)；否则上上月(offset 2)
  const firstOfMonth = new Date(Date.UTC(cnNow.getUTCFullYear(), cnNow.getUTCMonth(), 1, 14))
  const mOffset = cnNow >= firstOfMonth ? 1 : 2
  const mDate = new Date(Date.UTC(cnNow.getUTCFullYear(), cnNow.getUTCMonth() - mOffset, 1))
  const monthly = {
    type: 'month',
    offset: mOffset,
    key: `month-${mDate.getUTCFullYear()}-${mDate.getUTCMonth() + 1}`,
  }

  return { annual, monthly, annualOut }
}

// 访客是否已看过某期
export function isReportSeen(key) {
  return localStorage.getItem('yanqi-report-seen:' + key) === '1'
}

export function markReportSeen(key) {
  localStorage.setItem('yanqi-report-seen:' + key, '1')
}
