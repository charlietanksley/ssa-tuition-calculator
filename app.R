#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#

library(shiny)
library(dplyr)

tuition_data = data.frame(
  income = c(10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000),
  price = c(180, 360, 720, 1260, 1980, 2880, 3960, 5220, 6660, 8280, 10080, 12060, 14220, 16000),
  income_range = c('Under 20,000', '20,000 - 29,999', '30,000 - 39,999', '40,000 - 49,999', '50,000 - 59,999', '60,000 - 69,999', '70,000 - 79,999', '80,000 - 89,999', '90,000 - 99,999', '100,000 - 109,999', '110,000 - 119,999', '120,000 - 129,999', '130,000 - 139,999', '140,000+'))

tuition_data = mutate(tuition_data,
                      base_per_day = price / 5)

tuition_cap_data = data.frame(
  days = c(1, 2, 3, 4, 5),
  cap = c(1, 1, 1, 1, 8000)
)

tuition_data
ui <- fluidPage(
   
   # Application title
   titlePanel("Sudbury Tuition Calculator"),
   
   # Sidebar with a slider input for number of bins 
   sidebarLayout(
      sidebarPanel(
         selectInput("income",
                     "Net Income:",
                      choices = tuition_data$income_range),
         numericInput("days",
                      "Days Per Week:",
                      value = 5,
                      min = 1,
                      max = 5,
                      step = 1),
         numericInput("children",
                      "Children In Program:",
                      value = 1,
                      min = 1,
                      step = 1)
      ),
      
      # Show a plot of the generated distribution
      mainPanel(
         textOutput("tuition")
      )
   )
)

# Define server logic required to draw a histogram
server <- function(input, output) {
  tuition <- function() {
    tuition = filter(tuition_data, income_range == input$income)$price
  }
  
  tuition_cap <- function() {
    filter(tuition_cap_data, days == input$days)$cap
  }
  
  single_tuition <- function() {
    tuition = tuition()
    cap = tuition_cap()
    
    if (tuition > cap) {
      return(cap)
    }
    
    tuition  
  }
  
  additional_tuition <- function() {
    tuition = tuition() / 2
    cap = tuition_cap()
    if (tuition > cap) {
      return(cap)
    }
    tuition
  }
  
  calculate_tuition <- reactive({
    total_tuition = single_tuition()
    if (input$children > 1) {
      for (i in 2:input$children) {
        total_tuition = total_tuition + additional_tuition()
      }
      
      cap = tuition_cap()
      if (total_tuition == cap * input$children) {
        discount = cap * .1
        for (i in 2:input$children) {
          total_tuition = total_tuition - discount
        }
      }
    }
    #cap_tuition(total_tuition)
    total_tuition
  })
  
  output$tuition <- renderText({
    calculate_tuition()
    })
}

# Run the application 
shinyApp(ui = ui, server = server)

