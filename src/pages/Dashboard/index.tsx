import React, { useState, useEffect } from 'react'

import api from '../../services/api'

import Header from '../../components/Header'

import formatValue from '../../utils/formatValue'
import formatDate from '../../utils/formatDate'

import income from '../../assets/income.svg'
import outcome from '../../assets/outcome.svg'
import total from '../../assets/total.svg'

import { Container, CardContainer, Card, TableContainer } from './styles'

interface Transaction {
  id: string
  title: string
  value: string
  formattedValue: string
  formattedDate: string
  type: 'income' | 'outcome'
  category: {
    id: string
    title: string
  }
  created_at: Date
}

interface Balance {
  income: number
  outcome: number
  total: number
}

interface TransactionResponse {
  transactions: Transaction[]
  balance: Balance
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [balance, setBalance] = useState<Balance>({} as Balance)

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const { data } = await api.get<TransactionResponse>('/transactions')

      const transactionsFormatted = data.transactions.map(transaction => {
        const { created_at, value, type } = transaction

        const formattedValue = `${type === 'outcome' ? '- ' : ''}${formatValue(
          Number(value),
        )}`

        return {
          ...transaction,
          formattedDate: formatDate(created_at),
          formattedValue,
        }
      })

      setTransactions(transactionsFormatted)
      setBalance(data.balance)
    }

    loadTransactions()
  }, [])

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{formatValue(balance.income)}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {formatValue(balance.outcome)}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{formatValue(balance.total)}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {transaction.formattedValue}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  )
}

export default Dashboard
