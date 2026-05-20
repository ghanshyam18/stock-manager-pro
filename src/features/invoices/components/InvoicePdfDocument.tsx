import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

import { numberToIndianWords } from '../../../shared/utils/currencyWords';
import { Invoice, InvoiceItem } from '../../inventory/services/db';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#000',
  },
  invoiceTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  mainBorder: {
    borderWidth: 1,
    borderColor: '#000',
    flexDirection: 'column',
  },
  headerGrid: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  headerLeft: {
    width: '50%',
    borderRightWidth: 1,
    borderColor: '#000',
    padding: 5,
  },
  headerRight: {
    width: '50%',
    flexDirection: 'column',
  },
  headerRightRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  headerRightRowLast: {
    flexDirection: 'row',
    flexGrow: 1, // This stretches the last row to the bottom of the headerGrid, fixing the gap!
  },
  headerRightCell: {
    width: '50%',
    padding: 4,
    borderRightWidth: 1,
    borderColor: '#000',
  },
  headerRightCellLast: {
    width: '50%',
    padding: 4,
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  label: {
    fontSize: 7,
    color: '#333',
    marginBottom: 2,
  },
  valueText: {
    fontFamily: 'Helvetica-Bold',
  },
  billToTitle: {
    fontSize: 8,
    marginTop: 10,
    marginBottom: 2,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  tableColHeader: {
    padding: 4,
    borderRightWidth: 1,
    borderColor: '#000',
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    padding: 4,
    borderRightWidth: 1,
    borderColor: '#000',
  },
  colSl: { width: '5%' },
  colImg: { width: '12%', alignItems: 'center' },
  colDesc: { width: '43%' },
  colQty: { width: '12%', textAlign: 'right' },
  colRate: { width: '13%', textAlign: 'right' },
  colAmount: { width: '15%', textAlign: 'right', borderRightWidth: 0 },

  itemImage: {
    width: 30,
    height: 30,
    objectFit: 'contain',
  },

  tableSpacer: {
    flexDirection: 'row',
    flexGrow: 1,
    minHeight: 100,
  },
  tableColSpacer: {
    borderRightWidth: 1,
    borderColor: '#000',
  },

  totalsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  footerSection: {
    flexDirection: 'row',
  },
  footerLeft: {
    width: '60%',
    padding: 5,
    borderRightWidth: 1,
    borderColor: '#000',
  },
  footerRight: {
    width: '40%',
    padding: 5,
  },
  wordsBlock: {
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  signatureBox: {
    height: 60,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
});

interface InvoicePdfDocumentProps {
  invoice: Invoice;
  items: (InvoiceItem & { thumbnailUrl?: string })[];
  businessProfile?: {
    name: string;
    address: string;
    contact: string;
  };
}

export const InvoicePdfDocument: React.FC<InvoicePdfDocumentProps> = ({
  invoice,
  items,
  businessProfile,
}) => {
  const totalQty = items.reduce((acc, curr) => acc + Number(curr.quantity), 0);
  const amountInWords = numberToIndianWords(invoice.grandTotal);

  const profileName = businessProfile?.name || 'Your Company Name';
  const profileAddress = businessProfile?.address || '123 Business Street\nCity, State, ZIP';
  const profileContact = businessProfile?.contact || 'Phone: +91 98765 43210';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.invoiceTitle}>INVOICE</Text>

        <View style={styles.mainBorder}>
          {/* Header Block */}
          <View style={styles.headerGrid}>
            <View style={styles.headerLeft}>
              <Text style={styles.companyName}>{profileName}</Text>
              <Text>{profileAddress}</Text>
              <Text>{profileContact}</Text>

              <Text style={styles.billToTitle}>Buyer (Bill to)</Text>
              <Text style={styles.valueText}>{invoice.partyName}</Text>
              {invoice.partyAddress && <Text>{invoice.partyAddress}</Text>}
              {invoice.partyContact && <Text>Contact: {invoice.partyContact}</Text>}
            </View>

            <View style={styles.headerRight}>
              <View style={styles.headerRightRow}>
                <View style={styles.headerRightCell}>
                  <Text style={styles.label}>Invoice No.</Text>
                  <Text style={styles.valueText}>{invoice.invoiceNo}</Text>
                </View>
                <View style={styles.headerRightCellLast}>
                  <Text style={styles.label}>Dated</Text>
                  <Text style={styles.valueText}>
                    {new Date(invoice.date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
              <View style={styles.headerRightRow}>
                <View style={styles.headerRightCell}>
                  <Text style={styles.label}>Delivery Note</Text>
                  <Text></Text>
                </View>
                <View style={styles.headerRightCellLast}>
                  <Text style={styles.label}>Mode/Terms of Payment</Text>
                  <Text></Text>
                </View>
              </View>
              <View style={styles.headerRightRow}>
                <View style={styles.headerRightCell}>
                  <Text style={styles.label}>Reference No. & Date.</Text>
                  <Text></Text>
                </View>
                <View style={styles.headerRightCellLast}>
                  <Text style={styles.label}>Other References</Text>
                  <Text></Text>
                </View>
              </View>
              {/* Dispatched through gets a bottom border */}
              <View style={styles.headerRightRow}>
                <View style={styles.headerRightCell}>
                  <Text style={styles.label}>Dispatched through</Text>
                  <Text style={styles.valueText}>{invoice.dispatchedThrough}</Text>
                </View>
                <View style={styles.headerRightCellLast}>
                  <Text style={styles.label}>Destination</Text>
                  <Text></Text>
                </View>
              </View>

              {/* Empty stretching row to fill vertical gap while maintaining the middle line */}
              <View style={{ flexDirection: 'row', flexGrow: 1 }}>
                <View style={{ width: '50%', borderRightWidth: 1, borderColor: '#000' }}></View>
                <View style={{ width: '50%' }}></View>
              </View>
            </View>
          </View>

          {/* Table Header */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableColHeader, styles.colSl]}>Sl</Text>
            <Text style={[styles.tableColHeader, styles.colImg]}>Image</Text>
            <Text style={[styles.tableColHeader, styles.colDesc]}>Description of Goods</Text>
            <Text style={[styles.tableColHeader, styles.colQty]}>Quantity</Text>
            <Text style={[styles.tableColHeader, styles.colRate]}>Rate</Text>
            <Text style={[styles.tableColHeader, styles.colAmount, { borderRightWidth: 0 }]}>
              Amount
            </Text>
          </View>

          {/* Table Rows */}
          {items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={[styles.tableCol, styles.colSl]}>
                <Text style={{ textAlign: 'center' }}>{index + 1}</Text>
              </View>
              <View style={[styles.tableCol, styles.colImg]}>
                {item.thumbnailUrl ? (
                  <Image src={item.thumbnailUrl} style={styles.itemImage} />
                ) : (
                  <Text style={{ fontSize: 6, color: '#999' }}>-</Text>
                )}
              </View>
              <View style={[styles.tableCol, styles.colDesc]}>
                <Text style={styles.valueText}>Design No: {item.designNo}</Text>
              </View>
              <View style={[styles.tableCol, styles.colQty]}>
                <Text style={styles.valueText}>{item.quantity} PCS</Text>
              </View>
              <View style={[styles.tableCol, styles.colRate]}>
                <Text>
                  {item.unitPrice.toFixed(2)} <Text style={{ fontSize: 6 }}>/ PCS</Text>
                </Text>
              </View>
              <View style={[styles.tableCol, styles.colAmount, { borderRightWidth: 0 }]}>
                <Text style={styles.valueText}>{item.total.toFixed(2)}</Text>
              </View>
            </View>
          ))}

          {/* Discount / Tax Rows inside Table grid */}
          {(invoice.discountAmount > 0 || invoice.taxAmount > 0) && (
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, styles.colSl]}>
                <Text></Text>
              </View>
              <View style={[styles.tableCol, styles.colImg]}>
                <Text></Text>
              </View>
              <View style={[styles.tableCol, styles.colDesc]}>
                {invoice.discountAmount > 0 && (
                  <Text style={{ textAlign: 'right', fontFamily: 'Helvetica-Bold' }}>
                    Less: DISCOUNT {invoice.discountPercentage}%
                  </Text>
                )}
                {invoice.taxAmount > 0 && (
                  <Text style={{ textAlign: 'right', marginTop: 4, fontFamily: 'Helvetica-Bold' }}>
                    Add: TAX {invoice.taxPercentage}%
                  </Text>
                )}
              </View>
              <View style={[styles.tableCol, styles.colQty]}>
                <Text></Text>
              </View>
              <View style={[styles.tableCol, styles.colRate]}>
                <Text></Text>
              </View>
              <View style={[styles.tableCol, styles.colAmount, { borderRightWidth: 0 }]}>
                {invoice.discountAmount > 0 && (
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                    (-){invoice.discountAmount.toFixed(2)}
                  </Text>
                )}
                {invoice.taxAmount > 0 && (
                  <Text style={{ marginTop: 4, fontFamily: 'Helvetica-Bold' }}>
                    (+){invoice.taxAmount.toFixed(2)}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Spacer to force lines down */}
          <View style={styles.tableSpacer}>
            <View style={[styles.tableColSpacer, styles.colSl]} />
            <View style={[styles.tableColSpacer, styles.colImg]} />
            <View style={[styles.tableColSpacer, styles.colDesc]} />
            <View style={[styles.tableColSpacer, styles.colQty]} />
            <View style={[styles.tableColSpacer, styles.colRate]} />
            <View style={[styles.colAmount]} />
          </View>

          {/* Totals Row */}
          <View style={styles.totalsRow}>
            <View style={[styles.colSl, { borderRightWidth: 1, borderColor: '#000' }]}></View>
            <View style={[styles.colImg, { borderRightWidth: 1, borderColor: '#000' }]}></View>
            <View
              style={[styles.colDesc, { borderRightWidth: 1, borderColor: '#000', padding: 4 }]}
            >
              <Text style={{ textAlign: 'right', fontFamily: 'Helvetica-Bold' }}>Total</Text>
            </View>
            <View style={[styles.colQty, { borderRightWidth: 1, borderColor: '#000', padding: 4 }]}>
              <Text style={styles.valueText}>{totalQty} PCS</Text>
            </View>
            <View style={[styles.colRate, { borderRightWidth: 1, borderColor: '#000' }]}></View>
            <View style={[styles.colAmount, { padding: 4 }]}>
              <Text style={styles.valueText}>Rs. {invoice.grandTotal.toFixed(2)}</Text>
            </View>
          </View>

          {/* Amount in words */}
          <View style={styles.wordsBlock}>
            <Text style={styles.label}>Amount Chargeable (in words)</Text>
            <Text style={styles.valueText}>INR {amountInWords}</Text>
          </View>

          {/* Footer Signature */}
          <View style={styles.footerSection}>
            <View style={styles.footerLeft}>
              <Text style={[styles.label, { textDecoration: 'underline', marginBottom: 5 }]}>
                Declaration
              </Text>
              <Text>
                We declare that this invoice shows the actual price of the goods described and that
                all particulars are true and correct.
              </Text>
            </View>
            <View style={styles.footerRight}>
              <Text style={{ textAlign: 'right', fontFamily: 'Helvetica-Bold' }}>
                for {profileName}
              </Text>
              <View style={styles.signatureBox}>
                <Text>Authorised Signatory</Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={{ textAlign: 'center', fontSize: 8, marginTop: 10 }}>
          This is a Computer Generated Invoice
        </Text>
      </Page>
    </Document>
  );
};
