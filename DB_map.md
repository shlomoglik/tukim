# DB map 
- Cells
    - {cell}
        - cellIndex:number
        - cellStatus:string[active,empty,archive]
        - Sessions
            - {session}
                - isActiveSession:boolean
                - countEggs:number
                - countLive:number
                - countDeath:number
                - hatalaTime:string[dateString]
                - bekiaTime:string[dateString]
                - hafradaTime:string[dateString]
                - hatalaStatus:string[dateString]
                - bekiaStatus:string[dateString]
                - hafradaStatus:string[dateString]

# VIEWS
- Login
- Main  - cells view. 
    - filters: cellNumber / 3 days estimata / all   
    - views: list / cards
- Note  - pop up : add note / photo / video?
- Cell  - sessions history , notes
        