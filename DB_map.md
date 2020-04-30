# VIEWS
- TODO:
    - להוסיף ספרור של כמות ההערות
    - לבטל תצוגה של נורית התראה במידה והשלב הבא בוצע

# DB map 
- Cells
    - {cell}
        - cellIndex:number
        - cellStatus:string[active,empty,archive]
        - count
        - hatalaTime
        - bekiaTime
        - hafradaTime
        - Sessions
            - {session}
                - isActiveSession:boolean
                - count:number
                - countLive:number
                - countDeath:number
                - hatalaTime:string[dateString]
                - bekiaTime:string[dateString]
                - hafradaTime:string[dateString]
                <!-- - hatalaStatus:string[dateString]
                - bekiaStatus:string[dateString]
                - hafradaStatus:string[dateString] -->

# VIEWS
- Login
- Main  - cells view. 
    - filters: cellNumber / 3 days estimata / all   
    - views: list / cards
- Note  - pop up : add note / photo / video?   chat history
- Cell  - sessions history , notes
        