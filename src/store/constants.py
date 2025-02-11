#!/usr/bin/env python
# -*- coding: utf-8 -*-

##
# demo enviroment
#
ENV_DEMO= 'https://demo.ezcount.co.il'
##
# demo enviroment
#
ENV_PROD= 'https://www.ezcount.co.il'


##
# חשבונית מס
#
DOC_TYPE_INVOICE= 305
##
# קבלה
#
DOC_TYPE_RECEPTION= 400
##
# חשבונית מס קבלה
#
DOC_TYPE_INVOICE_RECEPTION= 320
##
# חשבונית זיכוי
#
DOC_TYPE_INVOICE_CREDIT= 330
##
# הצעת מחיר
#
DOC_TYPE_BID= 9999
##
# הזמנת עבודה
#
DOC_TYPE_ORDER= 100
##
# תעודת משלוח
#
DOC_TYPE_DELIVERY= 200
##
# תעודת החזרה
#
DOC_TYPE_RETURN= 210
##
# חשבונית עסקה
#
DOC_TYPE_INVOICE_TRANSACTION= 300
##
# הזמנת רכש
#
DOC_TYPE_PURCHASE_ORDER= 500
##
# קבלה על תרומה
#
DOC_TYPE_RECEIPT_DONATION= 405



##
# -1 מזומן; 2 - המחאה; 3 - כ. אשראי; 4 - העב.- בנקאית; 5 - תווי קניה; 6 -תלוש החלפה; 7שטר; -8 ה.קבע; 9 -אחר
#
PAYMENT_CASH= 1 #מזומן
PAYMENT_CHECK= 2 #המחאה
PAYMENT_CC= 3  #כרטיס אשראי
PAYMENT_TRANSFER= 4  #העב.- בנקאית
# <summary>
# כ.א. ישראכרט
# </summary>
CC_BRAND_ISRACART= 1

# <summary>
# כ.א. ויזה כאל
# </summary>
CC_BRAND_VISA_CAL= 2
# <summary>
# כ.א. דיינרס
# </summary>
CC_BRAND_DAINERS= 3
# <summary>
# כ.א. אמריקן אקספרס
# </summary>
CC_BRAND_AMERICAN_EXPRESS= 4

# <summary>
# כ.א. לאומי כארד
# </summary>
CC_BRAND_LEUMI_CARD= 6
# <summary>
# כ.א. מאסטרקארד
# </summary>
CC_BRAND_MASTER_CARD= 99



# <summary>
#תשלום רגיל 
# </summary>
CC_DEAL_TYPE_NORMAL= 1
# <summary>
# תשלומים
# </summary>
CC_DEAL_TYPE_PAYMENTS= 2
# <summary>
# קרדיט
# </summary>
CC_DEAL_TYPE_CREDIT= 3
# <summary>
# תשלום נדחה
# </summary>
CC_DEAL_TYPE_DEFERRED_CHARGES= 4
# <summary>
# אחר
# </summary>
CC_DEAL_TYPE_OTHER= 5
