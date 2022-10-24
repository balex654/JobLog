//
//  ViewActivitiesViewController.swift
//  Ride Track
//
//  Created by Ben Alexander on 10/21/22.
//

import UIKit
import CoreData

class ViewActivitiesViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {

    @IBOutlet weak var tableView: UITableView!
    
    var activities: [Activity] = []
    var context: NSManagedObjectContext?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return }
        context = appDelegate.persistentContainer.viewContext
        getActivities()
    }
    
    func getActivities() {
        let request = NSFetchRequest<Activity>(entityName: "Activity")
        let argArray = [ Variables.user.id ]
        request.predicate = NSPredicate(format: "userId = %@", argumentArray: argArray)
        request.sortDescriptors = [NSSortDescriptor(key: "startDate", ascending: false)]
        do {
            activities = try context!.fetch(request)
        }
        catch let error as NSError {
            print(error)
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return activities.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "viewActivitiesTableViewCell", for: indexPath) as! ViewActivitesTableViewCell
        let currentActivity = activities[indexPath.row]
        cell.ActivityLabel.text = currentActivity.name
        return cell
    }
}
