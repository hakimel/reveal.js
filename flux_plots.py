#!/usr/bin/env python
# coding: utf-8

# # Plots for Flux Financial

# In[152]:


#read in the data
import pandas as pd
data = pd.read_excel('FluxNumbers.xlsx')
data


# In[153]:


#Getting data to be positive
data_positive_original = data.iloc[0:5, 1:13].abs()
data_positive_original


# In[154]:


#Pivot the whole thing
data_positive = data_positive_original.transpose()
data_positive


# In[155]:


# STACKED AREA PLOT OF COSTS BREAKDOWN
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Data

x=range(1,13)
y=[data_positive[3], data_positive[4], data_positive[0], data_positive[1], data_positive[2]]

pal = sns.color_palette("Blues")
plt.stackplot(x, y, labels=['Staff','Technology','Legal','Audit/Accounting','Regulatory'], colors = pal, alpha = 0.8)
plt.legend(loc='upper left')
plt.title("Costs Breakdown")
plt.xlabel("Month")
plt.savefig("Costs_Breakdown")
plt.show()


# In[156]:


#OVERLAPPING AREA CHART OF REVENUE VS COSTS
costs = data_positive_original.sum()
revenue = data.iloc[6,:]
revenue = revenue.to_list()
del revenue[0]
plt.fill_between(np.arange(12), costs, color="skyblue",
                 alpha=0.5, label='costs')
plt.fill_between(np.arange(12), revenue, color="lightpink",
                 alpha=0.5, label='revenue')
plt.title("Revenue vs Costs")
plt.legend(loc='upper left')
#plt.ylabel("Total (USD)")
plt.xlabel("Month")
#plt.show()
plt.savefig("image/Revenue_vs_Costs.png")


# In[ ]:





# In[ ]:
